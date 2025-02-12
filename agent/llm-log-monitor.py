import os
import time
import re
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class LLMLogHandler(FileSystemEventHandler):
    def __init__(self, completion_pattern=r"<completion>"):
        self.completion_pattern = re.compile(completion_pattern)
        self.current_text = ""
        self.is_generating = False

    def on_modified(self, event):
        if not event.is_directory:
            with open(event.src_path, 'r', encoding='utf-8') as file:
                # ファイルの最後の部分だけを読む
                file.seek(0, 2)
                file_size = file.tell()
                file.seek(max(file_size - 4096, 0), 0)
                new_content = file.read()

                # 生成開始を検知
                if "<start>" in new_content and not self.is_generating:
                    self.is_generating = True
                    self.current_text = ""
                    print("生成開始を検知しました")

                # テキスト生成中
                if self.is_generating:
                    # 新しいテキストを追加
                    self.current_text += new_content

                    # 生成完了を検知
                    if self.completion_pattern.search(new_content):
                        self.is_generating = False
                        # 生成されたテキストから実際の出力部分を抽出
                        output_text = self.extract_output(self.current_text)
                        char_count = len(output_text)
                        print(f"\n生成完了！")
                        print(f"文字数: {char_count}")
                        print(f"生成されたテキスト:\n{output_text[:200]}...")  # 最初の200文字だけ表示

    def extract_output(self, text):
        # ログから実際の出力テキストを抽出するロジック
        # 以下は例として、<output>タグ間のテキストを抽出
        output_match = re.search(r"<output>(.*?)</output>", text, re.DOTALL)
        if output_match:
            return output_match.group(1).strip()
        return text.strip()

def monitor_log_file(log_path, completion_pattern=r"<completion>"):
    """
    指定されたログファイルを監視し、LLMの出力を追跡します
    
    Parameters:
        log_path (str): 監視するログファイルのパス
        completion_pattern (str): 生成完了を示す正規表現パターン
    """
    if not os.path.exists(log_path):
        print(f"エラー: ログファイル {log_path} が見つかりません")
        return

    event_handler = LLMLogHandler(completion_pattern)
    observer = Observer()
    observer.schedule(event_handler, os.path.dirname(log_path), recursive=False)
    observer.start()

    try:
        print(f"ログファイル {log_path} の監視を開始しました...")
        print("監視を停止するには Ctrl+C を押してください")
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        print("\n監視を停止しました")
    
    observer.join()

if __name__ == "__main__":
    # 使用例
    log_file = "/var/www/pera2/agent/logs/llm.log"  # 監視したいログファイルのパスを指定
    monitor_log_file(log_file)

