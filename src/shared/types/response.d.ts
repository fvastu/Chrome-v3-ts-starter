declare type MessageResponseType = 'SUCCESS' | 'FAILED' | 'PENDING' | 'UNAUTHORIZED' | 'AUTHENTICATED';

declare type MessageResponse<T = any> = {
    type: MessageResponseType;
    data?: T;
};
