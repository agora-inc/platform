import ast

class Tools:
    def __init__(self):
        pass
    
    @staticmethod
    def _wrapper(status_code, body):
        return {"statusCode": status_code, "body": body}

    @staticmethod
    def dict_to_bytes(dictionary_or_str):
        if type(dictionary_or_str) in [dict, str]:
            return bytes(str(dictionary_or_str), "utf-8")
        else:
            raise AssertionError(f"dict_to_bytes: {dictionary_or_str}")

    @staticmethod
    def bytes_to_dict(bytes_var):
        if type(bytes_var) == bytes:
            return ast.literal_eval(bytes_var.decode())
        else:
            raise AssertionError(f"bytes_to_dict: {bytes_str}")