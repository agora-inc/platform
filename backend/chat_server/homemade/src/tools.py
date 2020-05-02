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

    def split_concatenated_dict_strings(self, dict_string):
        assert(isinstance(dict_string, str))
        if dict_string[0] != "{" and dict_string[-1] != "}":
            raise Exception("split_concatenated_dict_strings: input is not a dict_string.")
        else:
            cut_index = dict_string.find("}{")
            if cut_index > 0:
                return dict_string[:cut_index + 1], self.split_concatenated_dict_strings(dict_string[cut_index + 1:]) 
            else:
                return dict_string
