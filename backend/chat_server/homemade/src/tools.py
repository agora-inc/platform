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

    def bytes_to_dict(self, bytes_var):
        if type(bytes_var) == bytes:
            dicts = self.split_concatenated_dict_strings(bytes_var.decode("utf-8"))
            list_dicts = []
            for dict_string in dicts:
                list_dicts.append(ast.literal_eval(dict_string))
            return list_dicts
        else:
            raise AssertionError(f"bytes_to_dict: {bytes_var}")

    def split_concatenated_dict_strings(self, dict_string):
        assert(isinstance(dict_string, str))
        list_dicts = []
        if len(dict_string) >= 2:
            if dict_string[0] != "{" and dict_string[-1] != "}":
                raise Exception("split_concatenated_dict_strings: input is not a dict_string.")
            else:
                cut_index = dict_string.find("}{")
                while cut_index >= 0:
                    list_dicts.append(dict_string[:cut_index + 1])
                    dict_string = dict_string[cut_index + 1:]
                    cut_index = dict_string.find("}{")

        if len(list_dicts) == 0:
            if dict_string[0] == "{" and dict_string[-1] == "}":
                return [dict_string]
            else:
                return list_dicts
        else:
            return list_dicts

## 
# if __name__ == "__main__":
#     obj = Tools()
#     a = "{'action': 'connect', 'chat_id': 17, 'utc_ts_s': 1588544299.7291903, 'user_id': 11111111}{'action': 'connect', 'chat_id': 17, 'utc_ts_s': 1588544299.7291903, 'user_id': 11111111}{'action': 'connect', 'chat_id': 17, 'utc_ts_s': 1588544299.7291903, 'user_id': 11111111}{'action': 'connect', 'chat_id': 17, 'utc_ts_s': 1588544299.7291903, 'user_id': 11111111}{'action': 'connect', 'chat_id': 17, 'utc_ts_s': 1588544299.7291903, 'user_id': 11111111}"
#     b = obj.split_concatenated_dict_strings(a)
#     b = obj.split_concatenated_dict_strings(a)
#     print(b)
