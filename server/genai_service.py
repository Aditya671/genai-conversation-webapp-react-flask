from pymongo import MongoClient
from bson.objectid import ObjectId

class MongoDBClient:
    def __init__(self, uri, db_name):
        self.client = MongoClient(uri)
        self.db = self.client[db_name]

    def get_all_conversations(self, user_id):
        conversations = self.db.conversations.find({'userId': user_id}).sort('dateTimeCreated', -1)
        return list(conversations)

    def get_all_messages(self, user_id, conversation_id):
        messages = self.db.messages.find({'userId': user_id, 'conversationId': conversation_id}).sort('dateTimeCreated', -1)
        return list(messages)

    def update_conversation_object(self, conversation_id, update_fields):
        self.db.conversations.update_one({'_id': ObjectId(conversation_id)}, {'$set': update_fields})

    def add_new_conversation(self, conversation):
        self.db.conversations.insert_one(conversation)

    def add_new_message(self, message):
        self.db.messages.insert_one(message)

    def get_all_user_feedback(self, user_id, conversation_id):
        feedback = self.db.userFeedback.find({'userId': user_id, 'conversationId': conversation_id})
        return list(feedback)
