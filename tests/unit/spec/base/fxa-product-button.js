/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/* For reference read the Jasmine and Sinon docs
 * Jasmine docs: https://jasmine.github.io/2.0/introduction.html
 * Sinon docs: http://sinonjs.org/docs/
 */

import FxaProductButton from '../../../../media/js/base/fxa-product-button.es6.js';

describe('fxa-product-button.js', function () {
    beforeEach(function () {
        const button = `<a class="js-fxa-product-button" href="https://accounts.firefox.com/signup?form_type=button&service=test&entrypoint=mozilla.org-whatsnew60&utm_source=mozilla.org-whatsnew60&utm_medium=referral&utm_campaign=whatsnew60&context=fx_desktop_v3" data-action="https://accounts.firefox.com/">Sign Up to Monitor</a>
             <a class="js-fxa-product-button" href="https://www.mozilla.org/en-US/firefox/accounts/">Learn more</a>
             <a class="js-fxa-product-button" href="https://accounts.firefox.com/subscriptions/products/prod_FiJ42WCzZNRSbS?plan=plan_FvPMH5lVx1vhV0&device_id=123456789&flow_begin_time=123456789&flow_id=123456789">Get Mozilla VPN</a>`;

        const data = {
            deviceId: '848377ff6e3e4fc982307a316f4ca3d6',
            flowBeginTime: '1573052386673',
            flowId: '75f9a48a0f66c2f5919a0989605d5fa5dd04625ea5a2ee59b2d5d54637c566d1'
        };

        const mockResponse = new window.Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-type': 'application/json'
            }
        });

        document.body.insertAdjacentHTML('beforeend', button);
        spyOn(window, 'fetch').and.returnValue(
            window.Promise.resolve(mockResponse)
        );
        spyOn(Mozilla.Client, '_isFirefoxDesktop').and.returnValue(true);
    });

    afterEach(function () {
        document.querySelectorAll('.js-fxa-product-button').forEach((e) => {
            e.parentNode.removeChild(e);
        });
    });

    it('should make a single metrics flow request', function () {
        spyOn(Mozilla.Client, 'getFirefoxDetails').and.callFake((callback) => {
            callback({
                accurate: true,
                distribution: undefined
            });
        });

        return FxaProductButton.init().then(() => {
            expect(window.fetch).toHaveBeenCalledTimes(1);
            expect(window.fetch).toHaveBeenCalledWith(
                'https://accounts.firefox.com/metrics-flow?form_type=button&service=test&entrypoint=mozilla.org-whatsnew60&utm_source=mozilla.org-whatsnew60&utm_campaign=whatsnew60&utm_medium=referral'
            );
        });
    });

    it('should attach flow parameters to button hrefs in the metrics response', function () {
        spyOn(Mozilla.Client, 'getFirefoxDetails').and.callFake((callback) => {
            callback({
                accurate: true,
                distribution: undefined
            });
        });

        return FxaProductButton.init().then(() => {
            const buttons = document.querySelectorAll('.js-fxa-product-button');
            expect(buttons[0].href).toEqual(
                'https://accounts.firefox.com/signup?form_type=button&service=test&entrypoint=mozilla.org-whatsnew60&utm_source=mozilla.org-whatsnew60&utm_medium=referral&utm_campaign=whatsnew60&context=fx_desktop_v3&device_id=848377ff6e3e4fc982307a316f4ca3d6&flow_begin_time=1573052386673&flow_id=75f9a48a0f66c2f5919a0989605d5fa5dd04625ea5a2ee59b2d5d54637c566d1'
            );
        });
    });

    it('should not attach flow parameters to button hrefs in the domain is invalid', function () {
        spyOn(Mozilla.Client, 'getFirefoxDetails').and.callFake((callback) => {
            callback({
                accurate: true,
                distribution: undefined
            });
        });

        return FxaProductButton.init().then(() => {
            const buttons = document.querySelectorAll('.js-fxa-product-button');
            expect(buttons[1].href).toEqual(
                'https://www.mozilla.org/en-US/firefox/accounts/'
            );
        });
    });

    it('should not overwrite flow parameters if already present', function () {
        spyOn(Mozilla.Client, 'getFirefoxDetails').and.callFake((callback) => {
            callback({
                accurate: true,
                distribution: undefined
            });
        });

        return FxaProductButton.init().then(() => {
            const buttons = document.querySelectorAll('.js-fxa-product-button');
            expect(buttons[2].href).toEqual(
                'https://accounts.firefox.com/subscriptions/products/prod_FiJ42WCzZNRSbS?plan=plan_FvPMH5lVx1vhV0&device_id=123456789&flow_begin_time=123456789&flow_id=123456789'
            );
        });
    });

    it('should overwrite flow parameters if explicitly stated', function () {
        spyOn(Mozilla.Client, 'getFirefoxDetails').and.callFake((callback) => {
            callback({
                accurate: true,
                distribution: undefined
            });
        });

        const overwrite = true;
        return FxaProductButton.init(overwrite).then(() => {
            const buttons = document.querySelectorAll('.js-fxa-product-button');
            expect(buttons[2].href).toEqual(
                'https://accounts.firefox.com/subscriptions/products/prod_FiJ42WCzZNRSbS?plan=plan_FvPMH5lVx1vhV0&device_id=848377ff6e3e4fc982307a316f4ca3d6&flow_begin_time=1573052386673&flow_id=75f9a48a0f66c2f5919a0989605d5fa5dd04625ea5a2ee59b2d5d54637c566d1'
            );
        });
    });

    it('should return false if no buttons are present in the DOM', function () {
        document.querySelectorAll('.js-fxa-product-button').forEach((e) => {
            e.parentNode.removeChild(e);
        });

        spyOn(FxaProductButton, 'fetchTokens');

        return FxaProductButton.init().catch(() => {
            expect(FxaProductButton.fetchTokens).not.toHaveBeenCalled();
        });
    });
});
