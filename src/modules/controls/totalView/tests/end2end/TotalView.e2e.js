const webdriver = require("selenium-webdriver"),
    {expect} = require("chai"),
    {initDriver, getDriver, quitDriver} = require("../../../../../../test/end2end/library/driver"),
    {getCenter} = require("../../../../../../test/end2end/library/scripts"),
    {losesCenter} = require("../../../../../../test/end2end/library/utils"),
    {isMaster, isEdge, isChrome, isSafari, isFirefox} = require("../../../../../../test/end2end/settings"),
    {logTestingCloudUrlToTest} = require("../../../../../../test/end2end/library/utils"),
    {By, Button, until} = webdriver;

/**
 * @param {Object} params e2eTestParams
 * @param {module:selenium-webdriver.Builder} params.builder the selenium.Builder object
 * @param {String} params.url the url to test
 * @param {String} params.resolution formatted as "AxB" with A, B integers
 * @param {String} params.browsername the name of the broser (to use chrome put "chrome" into the name)
 * @param {module:selenium-webdriver.Capabilities} param.capability sets the capability when requesting a new session - overwrites all previously set capabilities
 * @returns {void}
 */
function TotalViewTests ({builder, url, resolution, browsername, capability}) {
    const testIsApplicable = isMaster(url);

    if (testIsApplicable) {
        describe("Modules Controls TotalView", function () {
            let driver, totalViewButton;

            before(async function () {
                if (capability) {
                    capability.name = this.currentTest.fullTitle();
                    capability["sauce:options"].name = this.currentTest.fullTitle();
                    builder.withCapabilities(capability);
                }
                driver = await getDriver();
            });

            after(async function () {
                if (capability) {
                    driver.session_.then(function (sessionData) {
                        logTestingCloudUrlToTest(sessionData.id_);
                    });
                }
            });

            afterEach(async function () {
                if (this.currentTest._currentRetry === this.currentTest._retries - 1) {
                    await quitDriver();
                    driver = await initDriver(builder, url, resolution);
                }
            });


            it("should have a total view button", async function () {
                await driver.wait(until.elementLocated(By.css(".total-view-button")), 9000);
                totalViewButton = await driver.findElement(By.css(".total-view-button"));

                expect(totalViewButton).to.exist;
            });

            // canvas panning is currently broken in Chrome, see https://github.com/SeleniumHQ/selenium/issues/6332
            (isChrome(browsername) || isEdge(browsername) || isFirefox(browsername) || isSafari(browsername) ? it.skip : it)("should reset position on click after panning", async function () {
                const center = await driver.executeScript(getCenter),
                    viewport = await driver.findElement(By.css(".ol-viewport"));

                await driver.actions({bridge: true})
                    .move({origin: viewport})
                    .press(Button.LEFT)
                    .move({origin: viewport, x: 10, y: 10})
                    .release(Button.LEFT)
                    .perform();

                await losesCenter(driver, center);

                expect(center).not.to.eql(await driver.executeScript(getCenter));

                await driver.actions({bridge: true})
                    .click(totalViewButton)
                    .perform();

                expect(center).to.eql(await driver.executeScript(getCenter));
            });
        });
    }
}

module.exports = TotalViewTests;
