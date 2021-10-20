import ast 

def get_topic_mapping(topic_str: str):
		file = open("topics.txt")
		contents = file.read()
		dictionary = ast.literal_eval(contents)
		file.close()
		
		search_results = []
		if topic_str != None:
			for vals in list(dictionary.values()):
				vals_lower = [x.lower() for x in vals]
				if topic_str.lower() in vals_lower:
					search_results += [list(dictionary.keys())[list(dictionary.values()).index(vals)][1]]
		if(len(search_results)):
			return search_results[-1]
		else:
			return None

talk = {}
talk['topics_parsed'] = []
for topic_str in ['probability', 'algebraic topology', None]:
    talk['topics_parsed'] += [get_topic_mapping(topic_str)]

print(talk['topics_parsed'])