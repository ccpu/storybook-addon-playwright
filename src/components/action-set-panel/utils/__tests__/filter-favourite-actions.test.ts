import { FavouriteActionSet } from '../../../../typings/story-action';
import { filterFavouriteActions } from '../filter-favourite-actions';

const baseActionSet: FavouriteActionSet = {
  actions: [
    {
      id: 'action-id',
      name: 'action-name',
    },
  ],
  id: 'action-set-id',
  title: 'action-set-desc',
  visibleTo: '*',
};

describe('filterFavouriteActions', () => {
  it('should be defined', () => {
    expect(filterFavouriteActions).toBeDefined();
  });

  it('should have action for all stories', () => {
    const actionSet: FavouriteActionSet[] = [
      {
        ...baseActionSet,
        visibleTo: '*',
      },
    ];

    expect(filterFavouriteActions(actionSet, 'parent--story-id')).toStrictEqual(
      actionSet,
    );
  });

  it('should have action parent', () => {
    const actionSet: FavouriteActionSet[] = [
      {
        ...baseActionSet,
        visibleTo: 'parent',
      },
    ];

    expect(filterFavouriteActions(actionSet, 'parent--story-id')).toStrictEqual(
      actionSet,
    );
  });

  it('should have action for stories startWith', () => {
    const actionSet: FavouriteActionSet[] = [
      {
        ...baseActionSet,
        visibleTo: 'parent--story*',
      },
    ];

    expect(filterFavouriteActions(actionSet, 'parent--story-id')).toStrictEqual(
      actionSet,
    );

    expect(
      filterFavouriteActions(actionSet, 'parent--story-id-2'),
    ).toStrictEqual(actionSet);
  });

  it('should not have action for stories that story id not start with visibleTo', () => {
    const actionSet: FavouriteActionSet[] = [
      {
        ...baseActionSet,
        visibleTo: 'parent--story*',
      },
    ];

    expect(filterFavouriteActions(actionSet, 'parent')).toStrictEqual([]);
  });

  it('should match using regex', () => {
    const actionSet: FavouriteActionSet[] = [
      {
        ...baseActionSet,
        visibleTo: '^(parent1|parent2)',
      },
    ];

    expect(
      filterFavouriteActions(actionSet, 'parent1--story-id'),
    ).toStrictEqual(actionSet);

    expect(
      filterFavouriteActions(actionSet, 'parent2--story-id-2'),
    ).toStrictEqual(actionSet);
  });
});
