import * as TestFunctions from 'firebase-functions-test';

const testEnv = TestFunctions({});

// setup mocking functions config
testEnv.mockConfig({
  youtube: { 
    webhook_token: '12345678' 
  },
  telegram: { 
    bot_token: '12345678', 
    group_id: '12345678' 
  }
});

// mock firebase-admin
jest.mock('firebase-admin', () => ({
    initializeApp: jest.fn(),
    firestore: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnValue(Promise.resolve({exists: false})),
    set: jest.fn().mockReturnValue(Promise.resolve(true)),
}))

// mock telegram-bot
jest.mock('node-telegram-bot-api', () => {
    return jest.fn().mockImplementation(() => {
        return {
        setWebHook: jest.fn().mockResolvedValue(Promise.resolve()),
        onText: jest.fn(),
        sendMessage: jest.fn(),
        processUpdate: jest.fn()
        };
    });
});