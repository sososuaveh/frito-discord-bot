const assert = require("assert");
const sinon = require("sinon");

const handlers = require("../src/bot-command-handlers.js");

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

        it("Should default to 1d6 roll with empty arguments", function() {
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
            assert(sendMessageStub.called);
            let callArgs = sendMessageStub.getCall(0).args[0];
            assert.equal(callArgs.to, 3456);
            assert.equal(callArgs.message, "1d6: 2 = 2");
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
            assert.equal(callArgs.message, "1d6: 2 = 2");
        });

        it("Should assume 6 when die type not specified", function() {
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
                message: "2d"
            };
            handlers.roll(args);

            // Assert
            assert(sendMessageStub.called);
            let callArgs = sendMessageStub.getCall(0).args[0];
            assert.equal(callArgs.to, 3456);
            assert.equal(callArgs.message, "2d6: 2 + 5 = 7");
        });

        it("Should emit correctly when worst scenario specified", function() {
            // Arrange
            let sendMessageStub = this.sandbox.stub();
            let bot = {
                sendMessage: sendMessageStub
            };
            let randomStub = this.sandbox.stub(Math, "random");
            randomStub.onCall(0).returns(0.937548);
            randomStub.onCall(1).returns(0.304728);

            // Act
            let args = {
                bot: bot,
                user: "TestUser",
                userID: 1234,
                channelID: 3456,
                message: "w2d10"
            };
            handlers.roll(args);

            // Assert
            assert(sendMessageStub.called);
            let callArgs = sendMessageStub.getCall(0).args[0];
            assert.equal(callArgs.to, 3456);
            assert.equal(callArgs.message, "w[2d10]: 10, 4 -> worst: 4");
        });

        it("Should emit correctly when best scenario specified", function() {
            // Arrange
            let sendMessageStub = this.sandbox.stub();
            let bot = {
                sendMessage: sendMessageStub
            };
            let randomStub = this.sandbox.stub(Math, "random");
            randomStub.onCall(0).returns(0.937548);
            randomStub.onCall(1).returns(0.304728);

            // Act
            let args = {
                bot: bot,
                user: "TestUser",
                userID: 1234,
                channelID: 3456,
                message: "b2d10"
            };
            handlers.roll(args);

            // Assert
            assert(sendMessageStub.called);
            let callArgs = sendMessageStub.getCall(0).args[0];
            assert.equal(callArgs.to, 3456);
            assert.equal(callArgs.message, "b[2d10]: 10, 4 -> best: 10");
        });

        it("Should emit correctly when modifier is specified", function() {
            // Arrange
            let sendMessageStub = this.sandbox.stub();
            let bot = {
                sendMessage: sendMessageStub
            };
            let randomStub = this.sandbox.stub(Math, "random");
            randomStub.onCall(0).returns(0.937548);
            randomStub.onCall(1).returns(0.304728);

            // Act
            let args = {
                bot: bot,
                user: "TestUser",
                userID: 1234,
                channelID: 3456,
                message: "2d10+2"
            };
            handlers.roll(args);

            // Assert
            assert(sendMessageStub.called);
            let callArgs = sendMessageStub.getCall(0).args[0];
            assert.equal(callArgs.to, 3456);
            assert.equal(callArgs.message, "2d10+2: 10 + 4 = 14 modified: 16");
        });

        it("Should emit correctly when modifier is below 0", function() {
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
                message: "w2d6-3"
            };
            handlers.roll(args);

            // Assert
            assert(sendMessageStub.called);
            let callArgs = sendMessageStub.getCall(0).args[0];
            assert.equal(callArgs.to, 3456);
            assert.equal(callArgs.message, "w[2d6]-3: 2, 5 -> worst: 2 modified: 0");
        });

        it("Should emit error message when an error occurrs.", function() {
            // Arrange
            let sendMessageStub = this.sandbox.stub();
            let bot = {
                sendMessage: sendMessageStub
            };
            let consoleStub = this.sandbox.stub(console);
            let randomStub = this.sandbox.stub(Math, "random");
            randomStub.onCall(0).returns(0.233238);
            randomStub.onCall(1).returns(0.746827);
            randomStub.onCall(2).returns(0.196835);
            randomStub.onCall(3).returns(0.816854);
            randomStub.onCall(4).returns(0.068496);
            randomStub.onCall(5).returns(0.047205);
            randomStub.onCall(6).returns(0.390546);
            randomStub.onCall(7).returns(0.809345);

            // Act
            let args = {
                bot: bot,
                user: "TestUser",
                userID: 1234,
                channelID: 3456,
                message: 12
            };
            handlers.roll(args);

            // Assert
            assert.equal(sendMessageStub.called, true);
            assert.equal(consoleStub.log.callCount, 2);
            let callArgs = sendMessageStub.getCall(0).args[0];
            assert.equal(callArgs.to, 3456);
            assert.equal(
                callArgs.message.startsWith("I had a problem figuring out what to do. Ask a mod to check the logs with this error ID: "),
                true);
        });
    });
});
