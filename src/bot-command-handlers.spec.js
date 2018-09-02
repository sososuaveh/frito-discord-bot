const assert = require("assert");
const sinon = require("sinon");

const handlers = require("./bot-command-handlers.js");

describe("bot-command-handlers", function() {
    describe("#echo()", function() {
        it("Should emit the exact message to the channel", function() {
            // Arrange
            let sendMessageStub = this.sandbox.stub();
            let bot = {
                sendMessage: sendMessageStub
            };

            // Act
            let args = {
                bot: bot,
                user: "TestUser",
                userID: 1234,
                channelID: 3456,
                message: "sample message"
            };
            handlers.echo(args);

            // Assert
            assert(sendMessageStub.called);
            let callArgs = sendMessageStub.getCall(0).args[0];
            assert.equal(callArgs.to, 3456);
            assert.equal(callArgs.message, "sample message");
        });
    });

    describe("#roll()", function() {
        it("Should emit correctly for single roll", function() {
            // Arrange
            let sendMessageStub = this.sandbox.stub();
            let bot = {
                sendMessage: sendMessageStub
            };
            let randomStub = this.sandbox.stub(Math, "random");
            randomStub.onCall(0).returns(0.233238);
            randomStub.onCall(1).returns(0.746827);

            // Act
            let args = {
                bot: bot,
                user: "TestUser",
                userID: 1234,
                channelID: 3456,
                message: "2d6"
            };
            handlers.roll(args);

            // Assert
            assert(sendMessageStub.called);
            let callArgs = sendMessageStub.getCall(0).args[0];
            assert.equal(callArgs.to, 3456);
            assert.equal(callArgs.message, "2d6: 2 + 5 = 7");
        });

        it("Should emit correctly for multiple roll", function() {
            // Arrange
            let sendMessageStub = this.sandbox.stub();
            let bot = {
                sendMessage: sendMessageStub
            };
            let randomStub = this.sandbox.stub(Math, "random");
            randomStub.onCall(0).returns(0.233238);
            randomStub.onCall(1).returns(0.746827);
            randomStub.onCall(2).returns(0.937548);
            randomStub.onCall(3).returns(0.304728);

            // Act
            let args = {
                bot: bot,
                user: "TestUser",
                userID: 1234,
                channelID: 3456,
                message: "2d6 2d10"
            };
            handlers.roll(args);

            // Assert
            assert(sendMessageStub.called);
            let callArgs = sendMessageStub.getCall(0).args[0];
            assert.equal(callArgs.to, 3456);
            assert.equal(callArgs.message, "2d6: 2 + 5 = 7\n2d10: 10 + 4 = 14");
        });

        it("Should emit correctly for single roll of 2d0", function() {
            // Arrange
            let sendMessageStub = this.sandbox.stub();
            let bot = {
                sendMessage: sendMessageStub
            };
            let randomStub = this.sandbox.stub(Math, "random");
            randomStub.onCall(0).returns(0.233238);
            randomStub.onCall(1).returns(0.746827);

            // Act
            let args = {
                bot: bot,
                user: "TestUser",
                userID: 1234,
                channelID: 3456,
                message: "2d0"
            };
            handlers.roll(args);

            // Assert
            assert(sendMessageStub.called);
            let callArgs = sendMessageStub.getCall(0).args[0];
            assert.equal(callArgs.to, 3456);
            assert.equal(callArgs.message, "2d0: 0 + 0 = 0");
        });

        it("Should emit correctly for single roll of 2d1", function() {
            // Arrange
            let sendMessageStub = this.sandbox.stub();
            let bot = {
                sendMessage: sendMessageStub
            };
            let randomStub = this.sandbox.stub(Math, "random");
            randomStub.onCall(0).returns(0.233238);
            randomStub.onCall(1).returns(0.746827);

            // Act
            let args = {
                bot: bot,
                user: "TestUser",
                userID: 1234,
                channelID: 3456,
                message: "2d1"
            };
            handlers.roll(args);

            // Assert
            assert(sendMessageStub.called);
            let callArgs = sendMessageStub.getCall(0).args[0];
            assert.equal(callArgs.to, 3456);
            assert.equal(callArgs.message, "2d1: 1 + 1 = 2");
        });

        it("Should do nothing with empty arguments", function() {
            // Arrange
            let sendMessageStub = this.sandbox.stub();
            let bot = {
                sendMessage: sendMessageStub
            };
            let randomStub = this.sandbox.stub(Math, "random");
            randomStub.onCall(0).returns(0.233238);
            randomStub.onCall(1).returns(0.746827);

            // Act
            let args = {
                bot: bot,
                user: "TestUser",
                userID: 1234,
                channelID: 3456,
                message: ""
            };
            handlers.roll(args);

            // Assert
            assert(!sendMessageStub.called);
        });

        it("Should assume one when number of die not specified", function() {
            // Arrange
            let sendMessageStub = this.sandbox.stub();
            let bot = {
                sendMessage: sendMessageStub
            };
            let randomStub = this.sandbox.stub(Math, "random");
            randomStub.onCall(0).returns(0.233238);
            randomStub.onCall(1).returns(0.746827);

            // Act
            let args = {
                bot: bot,
                user: "TestUser",
                userID: 1234,
                channelID: 3456,
                message: "d6"
            };
            handlers.roll(args);

            // Assert
            assert(sendMessageStub.called);
            let callArgs = sendMessageStub.getCall(0).args[0];
            assert.equal(callArgs.to, 3456);
            assert.equal(callArgs.message, "d6: 2 = 2");
        });
    });
});