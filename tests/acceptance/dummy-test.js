import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import percySnapshot from '@percy/ember';

module('Acceptance | dummy', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /', async function(assert) {
    await visit('/');
    assert.equal(currentURL(), '/');
    await percySnapshot('dummy homepage test');
  });

  test('duplicate snapshots are skipped', async function(assert) {
    await visit('/');
    assert.equal(currentURL(), '/');
    await percySnapshot('dupe test');
    // Test duplicate name (should log warning and skip this snapshot):
    await percySnapshot('dupe test');
  });

  test('name is autogenerated if given a QUnit assert object', async function(assert) {
    assert.expect(0);
    await percySnapshot(assert);
  });

  test('name is autogenerated with unique name appended if given a QUnit assert object', async function(assert) {
    assert.expect(0);
    await percySnapshot(assert, { uniqueName: 'one' });
    await percySnapshot(assert, { uniqueName: 'two' });
  });

  test('name is autogenerated if given a Mocha test object', async function(assert) {
    assert.expect(0);
    var mochaTestDouble = {
      fullTitle: function() {
        return 'acceptance test - mocked fullTitle for Mocha tests';
      }
    };

    await percySnapshot(mochaTestDouble);
  });

  test('name is autogenerated with unique name appended if given a Mocha test object', async function(assert) {
    assert.expect(0);
    var mochaTestDouble = {
      fullTitle: function() {
        return 'acceptance test - mocked fullTitle for Mocha tests';
      }
    };

    await percySnapshot(mochaTestDouble, { uniqueName: 'one' });
    await percySnapshot(mochaTestDouble, { uniqueName: 'two' });
  });

  test('enableJavaScript option can pass through', async function(assert) {
    await visit('/');
    assert.equal(currentURL(), '/');
    await percySnapshot(assert, { enableJavaScript: true });
  });

  test('attributes on rootElement are copied to the DOM snapshot', async function(assert) {
    await visit('/test-route-styles');
    assert.equal(currentURL(), '/test-route-styles');
    await percySnapshot(assert);
  });

  test('class on body that turns it green is preserved the DOM snapshot', async function(assert) {
    await visit('/');
    // find's default scope is the testing container, so be sure to rescope to html
    let body = document.querySelector('body');
    body.setAttribute('class', 'AllGreen');
    assert.equal(currentURL(), '/');
    await percySnapshot(assert);

    // Remove AllGreen so it doesn't impact other tests
    assert.equal(body.getAttribute('class').includes('AllGreen'), true);
    body.removeAttribute('class');
  });

  test('passing a custom DOM transform', async function(assert) {
    await visit('/');
    assert.equal(currentURL(), '/');

    await percySnapshot(assert, {
      domTransformation: function(clonedDom) {
        let $scopedRoot = clonedDom.querySelector('#ember-testing');
        let $h1 = document.createElement('h1');
        $h1.innerText = 'Hello modified DOM!';
        $scopedRoot.appendChild($h1);

        return clonedDom;
      }
    });
  });
});
