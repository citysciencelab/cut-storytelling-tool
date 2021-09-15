import {expect} from "chai";
import {SensorThingsMqttConnector} from "../../sensorThingsMqttConnector.js";

describe("src/utils/sensorThingsMqttConnector.js", () => {
    let mqttClient = false;

    beforeEach(() => {
        mqttClient = new SensorThingsMqttConnector();
    });

    describe("constructor", () => {
        it("should set initial options and variables", () => {
            expect(mqttClient.options).to.be.an("object");
            expect(mqttClient.options.host).to.be.a("string");
            expect(mqttClient.options.port).to.be.a("string");
            expect(mqttClient.options.path).to.be.a("string");
            expect(mqttClient.options.protocol).to.be.a("string");
            expect(mqttClient.options.mqttVersion).to.be.a("string");
            expect(mqttClient.options.rhPath).to.be.a("string");
            expect(mqttClient.options.context).to.be.an("object");

            expect(mqttClient.mqttLibObject).to.be.null;
            expect(mqttClient.mqttClient).to.be.null;
            expect(mqttClient.httpClient).to.be.null;
            expect(mqttClient.handlers).to.be.an("object").and.to.be.empty;
        });
    });
    describe("connect", () => {
        it("should return false if no mqtt instance is set", () => {
            expect(mqttClient.connect).to.be.a("function");
            expect(mqttClient.connect()).to.be.false;
        });
        it("should return true if a valid mqtt instance is given", () => {
            const mqtt = {
                connect: () => {
                    return false;
                }
            };

            mqttClient.setMqttLibObject(mqtt);
            expect(mqttClient.connect()).to.be.true;
        });
        it("should hand over the set options to the connect function of the set mqtt instance", () => {
            let lastOptions = false;
            const mqtt = {
                connect: (options) => {
                    lastOptions = options;
                }
            };

            mqttClient.setMqttLibObject(mqtt);

            expect(mqttClient.connect()).to.be.true;
            expect(lastOptions).to.be.an("object");
        });
    });
    describe("setOptions", () => {
        it("should assign the given options to the default options", () => {
            const options = {
                host: "https://example.com",
                port: "1234"
            };

            mqttClient.setOptions(options);

            expect(mqttClient.options).to.be.an("object");
            expect(mqttClient.options.host).to.equal("https://example.com");
            expect(mqttClient.options.port).to.equal("1234");
            expect(mqttClient.options.path).to.be.a("string");
            expect(mqttClient.options.protocol).to.be.a("string");
            expect(mqttClient.options.mqttVersion).to.be.a("string");
            expect(mqttClient.options.rhPath).to.be.a("string");
            expect(mqttClient.options.context).to.be.an("object");
        });
        it("should assign the protocolId and protocolVersion of mqtt 3.1 if this version is set via options", () => {
            const options = {
                mqttVersion: "3.1"
            };

            mqttClient.setOptions(options);

            expect(mqttClient.options).to.be.an("object");
            expect(mqttClient.options.host).to.be.a("string");
            expect(mqttClient.options.port).to.be.a("string");
            expect(mqttClient.options.path).to.be.a("string");
            expect(mqttClient.options.protocol).to.be.a("string");
            expect(mqttClient.options.mqttVersion).to.equal("3.1");
            expect(mqttClient.options.rhPath).to.be.a("string");
            expect(mqttClient.options.context).to.be.an("object");
            expect(mqttClient.options.protocolId).to.equal("MQIsdp");
            expect(mqttClient.options.protocolVersion).to.equal(3);
        });
        it("should assign hostname to the options if not already set, using the host param", () => {
            const options = {
                host: "host"
            };

            mqttClient.setOptions(options);

            expect(mqttClient.options).to.be.an("object");
            expect(mqttClient.options.hostname).to.equal("host");
        });
    });
    describe("on", () => {
        it("should call an error if no valid mqtt instance is set", () => {
            let lastError = false;

            mqttClient.on("eventName", "handler", error => {
                lastError = error;
            });

            expect(lastError).to.be.a("string");
            expect(mqttClient.handlers).to.be.an("object").and.to.be.empty;
        });
        it("should call an error if a valid mqtt instance is set but the given handler is not a function", () => {
            let lastError = false;
            const mqtt = {
                connect: () => {
                    return {
                        on: () => {
                            return false;
                        }
                    };
                }
            };

            mqttClient.setMqttLibObject(mqtt);
            mqttClient.connect();
            mqttClient.on("eventName", "handler", error => {
                lastError = error;
            });

            expect(lastError).to.be.a("string");
            expect(mqttClient.handlers).to.be.an("object").and.to.be.empty;
        });
        it("should call an error if a valid mqtt instance and handler is given but the eventName is disconnect with mqttVersion 3.x", () => {
            let lastError = false;
            const mqtt = {
                connect: () => {
                    return {
                        on: () => {
                            return false;
                        }
                    };
                }
            };

            mqttClient.setMqttLibObject(mqtt);
            mqttClient.connect();
            mqttClient.setOptions({
                mqttVersion: "3.1"
            });
            mqttClient.on("disconnect", () => {
                return false;
            }, error => {
                lastError = error;
            });
            expect(lastError).to.be.a("string");
            expect(mqttClient.handlers).to.be.an("object").and.to.be.empty;

            lastError = false;
            mqttClient.setOptions({
                mqttVersion: "3.1.1"
            });
            mqttClient.on("disconnect", () => {
                return false;
            }, error => {
                lastError = error;
            });
            expect(lastError).to.be.a("string");
            expect(mqttClient.handlers).to.be.an("object").and.to.be.empty;
        });
        it("should add the given handler to the list of handlers and should call on with the eventName and the handler", () => {
            let lastError = false,
                lastEventName = false,
                lastHandler = false;
            const mqtt = {
                connect: () => {
                    return {
                        on: (eventName, handler) => {
                            lastEventName = eventName;
                            lastHandler = handler;
                        }
                    };
                }
            };

            mqttClient.setMqttLibObject(mqtt);
            mqttClient.connect();
            mqttClient.on("eventName", () => {
                return "result";
            }, error => {
                lastError = error;
            });

            expect(lastError).to.be.false;
            expect(mqttClient.handlers).to.be.an("object");
            expect(mqttClient.handlers.eventName).to.be.an("array").and.to.have.lengthOf(1);
            expect(mqttClient.handlers.eventName[0]).to.be.a("function");
            expect(mqttClient.handlers.eventName[0]()).to.equal("result");
            expect(lastEventName).to.equal("eventName");
            expect(lastHandler).to.be.a("function");
        });
    });
    describe("callHandlers", () => {
        it("should call all handlers with the given args", () => {
            let lastArgs = false;
            const handlers = [
                (...args) => {
                    lastArgs = args;
                }
            ];

            mqttClient.callHandlers(handlers, "eventName", 1, 2, 3);

            expect(lastArgs).to.deep.equal([1, 2, 3]);
        });
    });
    describe("callMessageHandler", () => {
        it("should call the given handler with topic and parsed json message and packet", () => {
            let lastTopic = false,
                lastJsonMessage = false,
                lastJsonPacket = false;

            mqttClient.callMessageHandler((topic, jsonMessage, jsonPacket) => {
                lastTopic = topic;
                lastJsonMessage = jsonMessage;
                lastJsonPacket = jsonPacket;
            }, "context", "topic", "[1]", "[2]");

            expect(lastTopic).to.equal("topic");
            expect(lastJsonMessage).to.deep.equal([1]);
            expect(lastJsonPacket).to.deep.equal([2]);
        });
    });
    describe("subscribe", () => {
        it("should call onerror if the set mqtt instance is not valid", () => {
            let lastError = false;

            mqttClient.subscribe("topic", "options", "onsuccess", error => {
                lastError = error;
            });

            expect(lastError).to.be.a("string");
        });
        it("should call subscribe with the topic and subscription options on the set mqtt instance", () => {
            let lastError = false,
                lastTopic = false,
                lastOptions = false,
                lastHandler = false;
            const mqtt = {
                connect: () => {
                    return {
                        subscribe: (topic, options, handler) => {
                            lastTopic = topic;
                            lastOptions = options;
                            lastHandler = handler;
                        }
                    };
                }
            };

            mqttClient.setMqttLibObject(mqtt);
            mqttClient.connect();
            mqttClient.subscribe("topic", {test: "test"}, "onsuccess", error => {
                lastError = error;
            });

            expect(lastError).to.be.false;
            expect(lastTopic).to.equal("topic");
            expect(lastOptions).to.deep.equal({
                qos: 0,
                rh: 2,
                test: "test"
            });
            expect(lastHandler).to.be.a("function");
        });
        it("should call onerror with the received error on subscription", () => {
            let lastError = false;
            const mqtt = {
                connect: () => {
                    return {
                        subscribe: (topic, options, handler) => {
                            handler("err", "granted");
                        }
                    };
                }
            };

            mqttClient.setMqttLibObject(mqtt);
            mqttClient.connect();
            mqttClient.subscribe("topic", "options", "onsuccess", error => {
                lastError = error;
            });

            expect(lastError).to.equal("err");
        });
        it("should call onsuccess with granted topic and qos", () => {
            let lastError = false,
                lastTopic = false,
                lastQos = false;
            const mqtt = {
                connect: () => {
                    return {
                        subscribe: (topic, options, handler) => {
                            handler(false, [{
                                topic: "grantedTopic",
                                qos: "grantedQos"
                            }]);
                        }
                    };
                }
            };

            mqttClient.setMqttLibObject(mqtt);
            mqttClient.connect();
            mqttClient.subscribe("topic", "options", (topic, qos) => {
                lastTopic = topic;
                lastQos = qos;
            }, error => {
                lastError = error;
            });

            expect(lastError).to.be.false;
            expect(lastTopic).to.equal("grantedTopic");
            expect(lastQos).to.equal("grantedQos");
        });
    });
    describe("unsubscribe", () => {
        it("should call the error handler if the mqtt instance is not valid", () => {
            let lastError = false;

            mqttClient.unsubscribe("topic", "options", "onsuccess", error => {
                lastError = error;
            });

            expect(lastError).to.be.a("string");
        });
        it("should call unsubscribe on the valid mqtt instance", () => {
            let lastError = false,
                lastTopic = false,
                lastOptions = false,
                lastHandler = false;
            const mqtt = {
                connect: () => {
                    return {
                        unsubscribe: (topic, options, handler) => {
                            lastTopic = topic;
                            lastOptions = options;
                            lastHandler = handler;
                        }
                    };
                }
            };

            mqttClient.setMqttLibObject(mqtt);
            mqttClient.connect();
            mqttClient.unsubscribe("topic", "options", "onsuccess", error => {
                lastError = error;
            });

            expect(lastError).to.be.false;
            expect(lastTopic).to.equal("topic");
            expect(lastOptions).to.equal("options");
            expect(lastHandler).to.be.a("function");
        });
        it("should call the error handler if an error is received during unsubscribe", () => {
            let lastError = false;
            const mqtt = {
                connect: () => {
                    return {
                        unsubscribe: (topic, options, handler) => {
                            handler("err");
                        }
                    };
                }
            };

            mqttClient.setMqttLibObject(mqtt);
            mqttClient.connect();
            mqttClient.unsubscribe("topic", "options", "onsuccess", error => {
                lastError = error;
            });

            expect(lastError).to.be.a("string");
        });
        it("should call success if everything worked out", () => {
            let lastError = false,
                onsuccessCalled = false;
            const mqtt = {
                connect: () => {
                    return {
                        unsubscribe: (topic, options, handler) => {
                            handler();
                        }
                    };
                }
            };

            mqttClient.setMqttLibObject(mqtt);
            mqttClient.connect();
            mqttClient.unsubscribe("topic", "options", () => {
                onsuccessCalled = true;
            }, error => {
                lastError = error;
            });

            expect(lastError).to.be.false;
            expect(onsuccessCalled).to.be.true;
        });
    });
    describe("end", () => {
        it("should call the error handler if the mqtt instance is not valid", () => {
            let lastError = false;

            mqttClient.unsubscribe("topic", "options", "onsuccess", error => {
                lastError = error;
            });

            expect(lastError).to.be.a("string");
        });
        it("should call end on the valid mqtt instance", () => {
            let lastError = false,
                lastForce = false,
                lastOptions = false,
                lastOnfinish = false;
            const mqtt = {
                connect: () => {
                    return {
                        end: (force, options, onfinish) => {
                            lastForce = force;
                            lastOptions = options;
                            lastOnfinish = onfinish;
                        }
                    };
                }
            };

            mqttClient.setMqttLibObject(mqtt);
            mqttClient.connect();
            mqttClient.end("force", "options", "onfinish", error => {
                lastError = error;
            });

            expect(lastError).to.be.false;
            expect(lastForce).to.equal("force");
            expect(lastOptions).to.equal("options");
            expect(lastOnfinish).to.equal("onfinish");
        });
    });
    describe("simulateRetainedHandling", () => {
        it("should do nothing if no message handlers are given", () => {
            let lastError = false,
                httpClientCalled = false;
            const httpClient = {
                get: () => {
                    httpClientCalled = true;
                }
            };

            mqttClient.setHttpClient(httpClient);
            mqttClient.simulateRetainedHandling("rhPath", "topic", [], error => {
                lastError = error;
            });

            expect(lastError).to.be.false;
            expect(httpClientCalled).to.be.false;
        });
        it("should call an error if no valid http client is set", () => {
            let lastError = false;

            mqttClient.simulateRetainedHandling("rhPath", "topic", ["handler"], error => {
                lastError = error;
            });

            expect(lastError).to.be.a("string");
        });
        it("should call an error if anything but a string is given as rhPath", () => {
            let lastError = false;
            const httpClient = {
                get: () => {
                    return false;
                }
            };

            mqttClient.setHttpClient(httpClient);
            mqttClient.simulateRetainedHandling(false, "topic", ["handler"], error => {
                lastError = error;
            });

            expect(lastError).to.be.a("string");
        });
        it("should call an error if anything but a string is given as topic", () => {
            let lastError = false;
            const httpClient = {
                get: () => {
                    return false;
                }
            };

            mqttClient.setHttpClient(httpClient);
            mqttClient.simulateRetainedHandling("rhPath", false, ["handler"], error => {
                lastError = error;
            });

            expect(lastError).to.be.a("string");
        });
        it("should call an url assambled together by rhpath and topic", () => {
            let lastError = false,
                lastUrl = false;
            const httpClient = {
                get: url => {
                    lastUrl = url;
                }
            };

            mqttClient.setHttpClient(httpClient);
            mqttClient.simulateRetainedHandling("rhPath", "topic", ["handler"], error => {
                lastError = error;
            });

            expect(lastError).to.be.false;
            expect(lastUrl).to.equal("rhPath/topic");
        });
        it("should add an order and top cut to the url if observations are detected on the topic", () => {
            let lastError = false,
                lastUrl = false;
            const httpClient = {
                get: url => {
                    lastUrl = url;
                }
            };

            mqttClient.setHttpClient(httpClient);
            mqttClient.simulateRetainedHandling("rhPath", "topic/observations", ["handler"], error => {
                lastError = error;
            });

            expect(lastError).to.be.false;
            expect(lastUrl).to.equal("rhPath/topic/observations?%24orderby=phenomenonTime%20desc&%24top=1");
        });
        it("should call the given handler(s) with topic, message and packet", () => {
            let lastError = false,
                lastTopic = false,
                lastMessage = false,
                lastPacket = false;
            const httpClient = {
                    get: (url, onsuccess) => {
                        onsuccess(["response"]);
                    }
                },
                expectedPacket = {
                    cmd: "simulate",
                    dup: false,
                    qos: 0,
                    retain: true,
                    topic: "topic",
                    payload: "response"
                };

            mqttClient.setHttpClient(httpClient);
            mqttClient.simulateRetainedHandling("rhPath", "topic", [(topic, message, packet) => {
                lastTopic = topic;
                lastMessage = message;
                lastPacket = packet;
            }], error => {
                lastError = error;
            });

            expect(lastError).to.be.false;
            expect(lastTopic).to.equal("topic");
            expect(lastMessage).to.equal("response");
            expect(lastPacket).to.deep.equal(expectedPacket);
        });
    });
});
