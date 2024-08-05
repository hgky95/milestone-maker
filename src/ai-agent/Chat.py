class Chat:
    def __init__(self, recipient, message, silent):
        self.recipient = recipient
        self.message = message
        self.silent = silent

    def toDict(self):
        return self.__dict__
