export const PageActionType = {
  Rename: 'Rename',
  Duplicate: 'Duplicate',
  Delete: 'Delete',
  DeleteCompletely: 'DeleteCompletely',
  Revert: 'Revert',
  NormalizeParent: 'NormalizeParent',
} as const;
export type PageActionType = typeof PageActionType[keyof typeof PageActionType]
export type IPageOperationProcessData = Partial<Record<PageActionType, {isProcessing: boolean}>>
export type IPageOperationProcessInfo = Partial<Record<string, IPageOperationProcessData>>
