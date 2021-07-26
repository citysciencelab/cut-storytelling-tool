import {expect} from "chai";
import {SensorThingsMqtt} from "@modules/core/modelList/layer/sensorThingsMqtt";
import {SensorThingsHttp} from "@modules/core/modelList/layer/sensorThingsHttp";

describe("core/modelList/layer/sensorThingsMqtt", function () {
    let mqtt = null,
        lastError = false;

    /**
     * a function to change lastError when an error occurs
     * @param {String} error the error
     * @returns {Void}  -
     */
    function onerror (error) {
        lastError = error;
    }

    beforeEach(() => {
        mqtt = new SensorThingsMqtt({
            host: "url",
            path: "/mqtt",
            protocol: "wss"
        }, {
            connect: () => {
                return false;
            }
        }, true);
        lastError = false;
    });

    describe("constructor", () => {
        it("should connect to mqtt with the given options", () => {
            let lastHost = false,
                lastPort = false,
                lastPath = false,
                lastProtocol = false,
                lastMqttVersion = false,
                lastRhPath = false,
                lastContext = false;

            new SensorThingsMqtt({
                host: "host",
                port: "port",
                path: "path",
                protocol: "protocol",
                mqttVersion: "mqttVersion",
                rhPath: "rhPath",
                context: "context"
            }, {
                connect: ({host, port, path, protocol, mqttVersion, rhPath, context}) => {
                    lastHost = host;
                    lastPort = port;
                    lastPath = path;
                    lastProtocol = protocol;
                    lastMqttVersion = mqttVersion;
                    lastRhPath = rhPath;
                    lastContext = context;
                }
            }, true);

            expect(lastHost).to.equal("host");
            expect(lastPort).to.equal("port");
            expect(lastPath).to.equal("path");
            expect(lastProtocol).to.equal("protocol");
            expect(lastMqttVersion).to.equal("mqttVersion");
            expect(lastRhPath).to.equal("rhPath");
            expect(lastContext).to.equal("context");
        });

        it("should expand the options for mqtt v3.1 by a different protocolId and protocolVersion", () => {
            let lastOptions = false;
            const givenOptions = {
                    host: "url",
                    mqttVersion: "3.1",
                    rhPath: "rhPath",
                    context: "this"
                },
                expectedOptions = {
                    host: "url",
                    mqttVersion: "3.1",
                    path: "/mqtt",
                    port: "",
                    protocol: "wss",
                    rhPath: "rhPath",
                    context: "this",
                    protocolId: "MQIsdp",
                    protocolVersion: 3
                };

            new SensorThingsMqtt(givenOptions, {
                connect: (options) => {
                    lastOptions = options;
                }
            }, true);

            expect(lastOptions).to.deep.equal(expectedOptions);
        });

        it("should set the internal mqttClient to whatever is returned by connect", () => {
            mqtt = new SensorThingsMqtt(null, {
                connect: () => {
                    return "mqttClient";
                }
            }, true);

            expect(mqtt.getMqttClient()).to.equal("mqttClient");
        });

        it("should set the default httpClient as instance of SensorThingsHttp", () => {
            expect(mqtt.getHttpClientDefault()).to.be.an.instanceof(SensorThingsHttp);
        });
    });

    describe("on", () => {
        it("should call onerror if anything but a function is given as handler", () => {
            mqtt.on("eventName", "handler", onerror);

            expect(lastError).to.be.a("string");
        });
        it("should refuse to set on(disconnect) if mqtt version equals 3.1", () => {
            mqtt.setMqttVersion("3.1");
            mqtt.on("disconnect", () => {
                // handler
                return false;
            }, onerror);

            expect(lastError).to.be.a("string");
        });
        it("should refuse to set on(disconnect) if mqtt version equals 3.1.1", () => {
            mqtt.setMqttVersion("3.1.1");
            mqtt.on("disconnect", () => {
                // handler
                return false;
            }, onerror);

            expect(lastError).to.be.a("string");
        });

        it("should register any event (other than message) at the given mqttClient", () => {
            let lastEventName = false;
            const mqttClient = new SensorThingsMqtt({}, {
                connect: () => {
                    return false;
                }
            }, true);

            mqttClient.on("eventName", () => {
                // handler
                return false;
            }, onerror, {
                // fake mqttClient
                on: eventName => {
                    lastEventName = eventName;
                }
            });

            expect(lastError).to.be.false;
            expect(lastEventName).to.equal("eventName");
        });
    });

    describe("subscribe", () => {
        it("should call mqttClient.subscribe with the given topic", () => {
            let lastTopic = false;

            mqtt.subscribe("topic", null, null, onerror, {
                // fake mqttClient
                subscribe: topic => {
                    lastTopic = topic;
                }
            }, () => {
                // simulateRetainedHandlingOpt
                return false;
            });

            expect(lastTopic).to.equal("topic");
        });
        it("should call mqttClient.subscribe with standard options", () => {
            let lastOptions = false;
            const expectedOptions = {
                qos: 0,
                rh: 2
            };

            mqtt.subscribe("topic", {}, null, onerror, {
                // fake mqttClient
                subscribe: (topic, options) => {
                    lastOptions = options;
                }
            }, () => {
                // simulateRetainedHandlingOpt
                return false;
            });

            expect(lastOptions).to.deep.equal(expectedOptions);
        });
        it("should call mqttClient.subscribe with the given options", () => {
            let lastOptions = false;
            const expectedOptions = {
                qos: 2,
                rh: 0,
                test: true
            };

            mqtt.subscribe("topic", expectedOptions, null, onerror, {
                // fake mqttClient
                subscribe: (topic, options) => {
                    lastOptions = options;
                }
            }, () => {
                // simulateRetainedHandlingOpt
                return false;
            });

            expect(lastOptions).to.deep.equal(expectedOptions);
        });
        it("should call onerror if any error occurs for subscription callback", () => {
            mqtt.subscribe("topic", null, null, onerror, {
                // fake mqttClient
                subscribe: (topic, options, callback) => {
                    callback(new Error("errmsg"));
                }
            }, () => {
                // simulateRetainedHandlingOpt
                return false;
            });

            expect(lastError).to.be.an.instanceof(Error);
        });
        it("should call onsuccess with granted response from subscription callback", () => {
            let lastTopic = false,
                lastQos = false;

            mqtt.subscribe("topic", {
                qos: 1
            }, (topic, qos) => {
                // onsuccess
                lastTopic = topic;
                lastQos = qos;
            }, onerror, {
                // fake mqttClient
                subscribe: (topic, options, callback) => {
                    callback(null, [{topic: topic, qos: options.qos}]);
                }
            }, () => {
                // simulateRetainedHandlingOpt
                return false;
            });

            expect(lastTopic).to.equal("topic");
            expect(lastQos).to.equal(1);
        });

        it("should call simulateRetainedHandling if options.rh !== 2 and mqtt v3.1 or mqtt v3.1.1 and options.rhPath is set", () => {
            let lastRhPath = false,
                lastTopic = false,
                lastHttpClient = false;
            const mqttClient = new SensorThingsMqtt({}, {
                connect: () => {
                    return false;
                }
            }, true);

            mqttClient.setMqttVersion("3.1");
            mqttClient.setRhPath("rhPath");
            mqttClient.on("message", () => {
                // handler
                return "messageHandler";
            }, onerror, {
                // fake mqttClient
                on: () => {
                    return false;
                }
            });
            mqttClient.subscribe("topic", {
                rh: 0
            }, null, onerror, {
                // fake mqttClient
                subscribe: (topic, options, callback) => {
                    callback(null, [{topic: topic, qos: options.qos}]);
                }
            }, (rhPath, topic, httpClient) => {
                lastRhPath = rhPath;
                lastTopic = topic;
                lastHttpClient = httpClient;
            });

            expect(lastRhPath).to.equal("rhPath");
            expect(lastTopic).to.equal("topic");
            expect(lastHttpClient).to.be.an.instanceof(SensorThingsHttp);
        });
        it("should call simulateRetainedHandling if options.rh !== 2 and mqtt v3.1 or mqtt v3.1.1 and options.rhPath is set", () => {
            let lastRhPath = false,
                lastTopic = false,
                lastHttpClient = false;
            const mqttClient = new SensorThingsMqtt({}, {
                connect: () => {
                    return false;
                }
            }, true);

            mqttClient.setMqttVersion("3.1.1");
            mqttClient.setRhPath("rhPath");
            mqttClient.on("message", () => {
                // handler
                return "messageHandler";
            }, onerror, {
                // fake mqttClient
                on: () => {
                    return false;
                }
            });
            mqttClient.subscribe("topic", {
                rh: 0
            }, null, onerror, {
                // fake mqttClient
                subscribe: (topic, options, callback) => {
                    callback(null, [{topic, qos: options.qos}]);
                }
            }, (rhPath, topic, httpClient) => {
                lastRhPath = rhPath;
                lastTopic = topic;
                lastHttpClient = httpClient;
            });

            expect(lastRhPath).to.equal("rhPath");
            expect(lastTopic).to.equal("topic");
            expect(lastHttpClient).to.be.an.instanceof(SensorThingsHttp);
        });
    });

    describe("unsubscribe", () => {
        it("should call unsubscribe with the given topic", () => {
            let lastTopic = false;

            mqtt.unsubscribe("topic", null, null, onerror, {
                // fake mqttClient
                unsubscribe: (topic) => {
                    lastTopic = topic;
                }
            });

            expect(lastTopic).to.equal("topic");
        });
        it("should call unsubscribe with the given options", () => {
            let lastOptions = false;
            const expectedOptions = {
                key: "value"
            };

            mqtt.unsubscribe("topic", expectedOptions, null, onerror, {
                // fake mqttClient
                unsubscribe: (topic, options) => {
                    lastOptions = options;
                }
            });

            expect(lastOptions).to.deep.equal(expectedOptions);
        });
        it("should call onerror when an error is given via callback", () => {
            mqtt.unsubscribe("topic", null, null, onerror, {
                // fake mqttClient
                unsubscribe: (topic, options, callback) => {
                    callback(new Error("errmsg"));
                }
            });

            expect(lastError).to.be.an.instanceof(Error);
        });
        it("should call onsuccess when no error occurs during callback", () => {
            let onsuccessCalled = false;

            mqtt.unsubscribe("topic", null, () => {
                onsuccessCalled = true;
            }, onerror, {
                // fake mqttClient
                unsubscribe: (topic, options, callback) => {
                    callback(null);
                }
            });

            expect(onsuccessCalled).to.be.true;
        });
    });

    describe("end", () => {
        it("should call end with the given parameters on the mqttClient", () => {
            let lastForce = false,
                lastOptions = false,
                lastCallback = false;
            const expectedOptions = {key: "value"};

            mqtt.end("force", expectedOptions, "onfinish", {
                end: (force, options, callback) => {
                    lastForce = force;
                    lastOptions = options;
                    lastCallback = callback;
                }
            });

            expect(lastForce).to.equal("force");
            expect(lastOptions).to.deep.equal(expectedOptions);
            expect(lastCallback).to.equal("onfinish");
        });
    });

    describe("simulateRetainedHandling", () => {
        it("should call onerror if an unexpected httpClient is given", () => {
            mqtt.simulateRetainedHandling("rhPath", "topic", "httpClient", onerror);

            expect(lastError).to.be.a("string");
        });
        it("should concat rhPath and topic if anything but an observation is subscribed via topic", () => {
            let lastUrl = false;
            const expectedUrl = "rhPath/topic";

            mqtt.simulateRetainedHandling("rhPath", "topic", {
                // fake httpClient
                get: url => {
                    lastUrl = url;
                }
            }, onerror);

            expect(lastUrl).to.equal(expectedUrl);
        });
        it("should expand the url with orderby + top if an observation is subscribed (1)", () => {
            let lastUrl = false;
            const expectedUrl = "rhPath/topic/Observations?%24orderby=phenomenonTime%20desc&%24top=1";

            mqtt.simulateRetainedHandling("rhPath", "topic/Observations", {
                // fake httpClient
                get: url => {
                    lastUrl = url;
                }
            }, onerror);

            expect(lastUrl).to.equal(expectedUrl);
        });
        it("should expand the url with orderby + top if an observation is subscribed (2)", () => {
            let lastUrl = false;
            const expectedUrl = "rhPath/topic(1234)/Observations(5678)?%24orderby=phenomenonTime%20desc&%24top=1";

            mqtt.simulateRetainedHandling("rhPath", "topic(1234)/Observations(5678)", {
                // fake httpClient
                get: url => {
                    lastUrl = url;
                }
            }, onerror);

            expect(lastUrl).to.equal(expectedUrl);
        });

        it("should call the message handler with topic, response and packet", () => {
            let lastTopic = false,
                lastMessage = false,
                lastPacket = false,
                lastEventName = false;
            const mqttClient = new SensorThingsMqtt({}, {
                    connect: () => {
                        return false;
                    }
                }, true),
                expectedPacket = {
                    cmd: "simulate",
                    dup: false,
                    payload: "message",
                    qos: 0,
                    retain: true,
                    topic: "topic"
                };

            mqttClient.on("message", (topic, message, packet) => {
                lastTopic = topic;
                lastMessage = message;
                lastPacket = packet;
            }, onerror, {
                // fake mqttClient
                on: (eventName) => {
                    lastEventName = eventName;
                }
            });

            mqttClient.simulateRetainedHandling("rhPath", "topic", {
                get: (url, onsuccess) => {
                    onsuccess(["message"]);
                }
            });

            expect(lastTopic).to.equal("topic");
            expect(lastMessage).to.equal("message");
            expect(lastPacket).to.deep.equal(expectedPacket);
            expect(lastEventName).to.equal("message");
        });
    });

    describe("multiton pattern", () => {
        it("should reuse a mqtt connection based on the given options", () => {
            let lastHost = false,
                lastPort = false,
                lastPath = false,
                lastProtocol = false,
                lastMqttVersion = false,
                lastRhPath = false,
                lastContext = false,
                usedConnect = 0;

            new SensorThingsMqtt({
                host: "host",
                port: "port",
                path: "path",
                protocol: "protocol",
                mqttVersion: "mqttVersion",
                rhPath: "rhPath",
                context: "contextA"
            }, {
                connect: ({host, port, path, protocol, mqttVersion, rhPath, context}) => {
                    lastHost = host;
                    lastPort = port;
                    lastPath = path;
                    lastProtocol = protocol;
                    lastMqttVersion = mqttVersion;
                    lastRhPath = rhPath;
                    lastContext = context;
                    usedConnect = 1;
                }
            });

            new SensorThingsMqtt({
                host: "host",
                port: "port",
                path: "path",
                protocol: "protocol",
                mqttVersion: "mqttVersion",
                rhPath: "rhPath",
                context: "contextB"
            }, {
                connect: ({host, port, path, protocol, mqttVersion, rhPath, context}) => {
                    lastHost = host;
                    lastPort = port;
                    lastPath = path;
                    lastProtocol = protocol;
                    lastMqttVersion = mqttVersion;
                    lastRhPath = rhPath;
                    lastContext = context;
                    usedConnect = 2;
                }
            });

            expect(lastHost).to.equal("host");
            expect(lastPort).to.equal("port");
            expect(lastPath).to.equal("path");
            expect(lastProtocol).to.equal("protocol");
            expect(lastMqttVersion).to.equal("mqttVersion");
            expect(lastRhPath).to.equal("rhPath");
            expect(lastContext).to.equal("contextA");
            expect(usedConnect).to.equal(1);
        });
    });
});
