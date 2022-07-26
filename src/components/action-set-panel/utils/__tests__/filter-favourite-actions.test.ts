import { ActionSet } from '../../../../typings/story-action';
import { filterFavouriteActions } from '../filter-favourite-actions';

const baseActionSet: ActionSet = {
  visibleTo: '*',
  actions: [
    {
      id: 'action-id',
      name: 'action-name',
    },
  ],
  id: 'action-set-id',
  title: 'action-set-desc',
};

describe('filterFavouriteActions', () => {
  it('should be defined', () => {
    expect(filterFavouriteActions).toBeDefined();
  });

  it('should have action for all stories', () => {
    const actionSet: ActionSet[] = [
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
    const actionSet: ActionSet[] = [
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
    const actionSet: ActionSet[] = [
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
    const actionSet: ActionSet[] = [
      {
        ...baseActionSet,
        visibleTo: 'parent--story*',
      },
    ];

    expect(filterFavouriteActions(actionSet, 'parent')).toStrictEqual([]);
  });

  it('should match using regex', () => {
    const actionSet: ActionSet[] = [
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
