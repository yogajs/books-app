import { GraphQLInputObjectType, GraphQLList, GraphQLNonNull, GraphQLBoolean, GraphQLID } from 'graphql';

import { getObjectId } from '../../../common/utils';

import CreatedAtOrderingInputType, { CreatedAtOrdering } from '../../../core/graphql/enum/CreatedAtOrderingInputType';

import { FILTER_CONDITION_TYPE, FilterMapping, buildSortFromOrderByArg } from '../../../core/graphql/graphqlFilters';

import { GraphQLArgFilter, ObjectId } from '../../../types';

export type ReadingsArgFilters = GraphQLArgFilter<{
  orderBy?: Array<{ sort: string; direction: string }>;
  book?: ObjectId;
}>;

export const readingFilterMapping: FilterMapping = {
  orderBy: {
    type: FILTER_CONDITION_TYPE.AGGREGATE_PIPELINE,
    pipeline: (value: CreatedAtOrdering[]) => [{ $sort: buildSortFromOrderByArg(value) }],
  },
  book: {
    type: FILTER_CONDITION_TYPE.MATCH_1_TO_1,
    key: 'bookId',
    format: (book: string) => getObjectId(book),
  },
  finished: {
    type: FILTER_CONDITION_TYPE.AGGREGATE_PIPELINE,
    pipeline: (finished: boolean) => {
      return [
        {
          $lookup: {
            from: 'Book',
            localField: 'bookId',
            foreignField: '_id',
            as: 'book',
          },
        },
        { $unwind: '$book' },
        {
          $project: {
            finished: {
              $switch: {
                branches: [{ case: { $eq: ['$readPages', '$book.pages'] }, then: true }],
                default: false,
              },
            },
          },
        },
        // @TODO - discover why the match directly is not working { $match: { readPages: '$book.pages' } }
        {
          $match: {
            finished,
          },
        },
      ];
    },
  },
};

const ReadingsFiltersInputType: GraphQLInputObjectType = new GraphQLInputObjectType({
  name: 'ReadingFilters',
  description: 'Used to filter readings',
  fields: () => ({
    OR: {
      type: GraphQLList(ReadingsFiltersInputType),
    },
    AND: {
      type: GraphQLList(ReadingsFiltersInputType),
    },
    orderBy: {
      type: GraphQLList(GraphQLNonNull(CreatedAtOrderingInputType)),
      description: "[{ direction: 'ASC', sort: 'CREATED_AT' }]",
    },
    finished: {
      type: GraphQLBoolean,
      description: 'Filter by book finished status.',
    },
    book: {
      type: GraphQLID,
      description: 'Filter by book.',
    },
  }),
});

export default ReadingsFiltersInputType;
