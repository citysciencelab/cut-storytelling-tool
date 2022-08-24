import {expect} from "chai";
import sinon from "sinon";
import actions from "../../../store/actionsPortalFooter";
import statePortalFooter from "../../../store/statePortalFooter";

describe("src/modules/portalFooter/store/actionsPortalFooter", () => {
    const urls = [{
            "bezeichnung": "abc",
            "url": "https://abc.de",
            "alias": "ABC",
            "alias_mobil": "ABC"
        },
        {
            "bezeichnung": "",
            "url": "",
            "alias": "SDP Download",
            "toolModelId": "SdpDownload"
        }],
        footerInfo = [{
            title: "Titel",
            description: "Test description",
            subtexts: [
                {
                    subtitle: "Subtitle",
                    text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
                },
                {
                    subtitle: "Another subtitle",
                    text: "At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
                }
            ]
        }];
    let commit, state;

    beforeEach(() => {
        commit = sinon.spy();
        Config = {
            footer: {
                urls: urls,
                showVersion: false,
                footerInfo: footerInfo
            }
        };
        state = {...statePortalFooter};
        state.footerInfo = footerInfo;
    });
    afterEach(sinon.restore);

    describe("renderFooterInfo", () => {
        it("renders the footer info from the configuration", () => {
            const subtexts = [
                [
                    {
                        subtitle: "Subtitle",
                        text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
                    },
                    {
                        subtitle: "Another subtitle",
                        text: "At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
                    }
                ]
            ];

            actions.renderFooterInfo({state, commit});
            expect(commit.firstCall.args[0]).to.equal("setInfoTitles");
            expect(commit.firstCall.args[1]).to.deep.equal(["Titel"]);
            expect(commit.secondCall.args[0]).to.equal("setInfoSubtexts");
            expect(commit.secondCall.args[1]).to.deep.equal(subtexts);
        });
    });
});
