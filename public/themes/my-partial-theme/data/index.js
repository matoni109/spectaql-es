// below from:
// https://github.com/anvilco/spectaql/issues/208#issuecomment-1086353206
import get from 'lodash/get'
import groupBy from 'lodash/groupBy'

import sortBy from 'lodash/sortBy'
import { Microfiber as IntrospectionManipulator } from 'microfiber'

export default ({ introspectionResponse, graphQLSchema: _graphQLSchema }) => {
  const introspectionManipulator = new IntrospectionManipulator(
    introspectionResponse
  )
  const queryType = introspectionManipulator.getQueryType()
  const mutationType = introspectionManipulator.getMutationType()
  const otherTypes = introspectionManipulator.getAllTypes({
    includeQuery: false,
    includeMutation: false,
    includeSubscription: false,
  })

  const groupedOtherTypes = groupBy(otherTypes, (thing) => {
    return thing.kind
  })

  return [
    {
      name: 'Reference',
      hideInContent: true,
      items: [
        {
          name: 'Queries',
          makeNavSection: true,
          makeContentSection: true,
          items: sortBy(
            queryType.fields.map((query) => ({
              ...query,
              isQuery: true,
            })),
            'name'
          ),
        },
        {
          name: 'Mutations',
          makeNavSection: true,
          makeContentSection: true,
          items: sortBy(
            mutationType.fields.map((query) => ({
              ...query,
              isMutation: true,
            })),
            'name'
          ),
        },
        ...Object.entries(groupedOtherTypes).map(
          ([kind, types]) => {
            return {
              name: kind,
              makeNavSection: true,
              makeContentSection: true,
              items: sortBy(
                types.map((type) => ({
                  ...type,
                  isType: true,
                })),
                'name'
              ),
            }
          }
        ),
      ],
    }
  ].filter(Boolean)
}
