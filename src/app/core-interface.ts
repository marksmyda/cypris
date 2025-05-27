export interface CoreInterface {
  totalHits: number
  limit: number
  offset: number
  results: Result[]
  searchId: string
}

export interface Result {
  acceptedDate: string
  arxivId?: string
  authors: Author[]
  citationCount: number
  contributors: string[]
  outputs: string[]
  createdDate: string
  dataProviders: DataProvider[]
  depositedDate: string
  abstract: string
  documentType?: string
  doi?: string
  downloadUrl: string
  fieldOfStudy: any
  fullText: string
  id: number
  identifiers: Identifier[]
  title: string
  language: Language
  magId: any
  oaiIds: string[]
  publishedDate: string
  publisher: string
  pubmedId: any
  references: any[]
  sourceFulltextUrls: string[]
  updatedDate: string
  yearPublished: number
  journals: any[]
  links: Link[]
}

export interface Author {
  name: string
}

export interface DataProvider {
  id: number
  name: string
  url: string
  logo: string
}

export interface Identifier {
  identifier: string
  type: string
}

export interface Language {
  code: string
  name: string
}

export interface Link {
  type: string
  url: string
}

type FieldValue = string;
type Frequency = number;
export type Aggregation = Record<
    'aggregations', 
    Record<'yearPublished', Record<FieldValue, Frequency>>
>;