import { filterLearning, learningResources } from '../src/data/learning';
import { layoutFor } from '../src/utils/layout';

it('combines search, topic, format and saved filters', () => {
  expect(
    filterLearning('  RECURVE  ', 'Equipment', 'Video', []).map(
      item => item.id,
    ),
  ).toEqual(['recurve-video']);
  expect(
    filterLearning('', 'Saved', 'All formats', ['recurve-guide']).map(
      item => item.id,
    ),
  ).toEqual(['recurve-guide']);
  expect(filterLearning('', 'Saved', 'Article', [])).toEqual([]);
  expect(filterLearning('no-such-resource', 'All', 'All formats', [])).toEqual(
    [],
  );
  expect(new Set(learningResources.map(item => item.id)).size).toBe(
    learningResources.length,
  );
});
it('reflows between compact, expanded and large-text windows', () => {
  expect(layoutFor(320, 568)).toMatchObject({
    compact: true,
    columns: 1,
  });
  expect(layoutFor(669, 951)).toMatchObject({ wide: true, columns: 2 });
  expect(layoutFor(900, 700)).toMatchObject({
    wide: true,
    columns: 2,
  });
  expect(layoutFor(900, 700, 1.6)).toMatchObject({
    wide: false,
    columns: 1,
  });
  expect(layoutFor(900, 420)).toMatchObject({ compact: true });
  expect(layoutFor(390, 800)).toMatchObject({ columns: 1 });
});
