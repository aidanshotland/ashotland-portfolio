import graphQlClient from "@/utils/contentful-graphql-client";

export default async function fetchPageData(slug: string) {
  const query = `{
  pageCollection(limit: 1, where: {slug: "${slug}"}) {
    items {
      slug
      __typename
      hero {
        sys {
          id
        }
        __typename
        heading
        eyebrowText
        decription
        ctaCollection(limit: 2) {
          items {
            ...CTAFields
          }
        }
      }
      componentsCollection(limit: 3) {
        items {
          ... on ComponentGroup {
            componentsCollection(limit: 5) {
              items {
                ...CenteredHeadlineFields
                ...CardFields
                ...CardBlockFields
                ...TwoColumnTextAndMediaFields
              }
            }
          }
        }
      }
    }
  }
}

fragment CTAFields on Button {
  __typename
  sys {
    id
  }
  variant
  text
  link
}

fragment CenteredHeadlineFields on CenteredHeadline {
  __typename
  sys {
    id
  }
  heading
  subHeading
}

fragment CardFields on Card {
  __typename
  sys {
    id
  }
  variant
  color
  image {
    ...MediaFields
  }
  heading
  subHeading
  description
}

fragment LogoFields on Logo {
  __typename
  sys {
    id
  }
  svg
  borderColor
}

fragment CardBlockFields on CardBlock {
  __typename
  sys {
    id
  }
  cardsCollection(limit: 4) {
    items {
      ...LogoFields
    }
  }
}

fragment TwoColumnTextAndMediaFields on TwoColumnTextAndMedia {
  __typename
  sys {
    id
  }
  heading
  description
  subheading
  cardBlock {
    ...CardBlockFields
  }
  image {
    ...MediaFields
  }
  imagePositon
}

fragment MediaFields on Asset {
  title
  description
  url
  height
  width
}`;

  const {
    data: {
      pageCollection: { items },
    },
  } = await graphQlClient<{
    data: {
      pageCollection: {
        items: any[];
      };
    };
  }>(query, [`page-${slug}`]);

  return items?.[0] ?? null;
}
