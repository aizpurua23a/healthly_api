const dayController = require('./dayController');

test('Registry works', () => {
    expect(dayController.day_list()).not.toBeNull();
});