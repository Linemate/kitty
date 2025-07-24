import { ReactElement, ReactNode } from 'react';

export type userInfoProps = {
    id: number;
    email: string;
    name: string;
    token: string;
    refreshToken: string;
} | null;

export type hiddenInfoProps = {
    id: number;
    programId: number;
    address: string;
};

export type imagesProps = {
    id: number;
    image: imageProps;
    type: string;
};

export type programSummaryWrapProps = {
    program: programSummaryProps;
};

export type bannerProps = {
    id: number;
    clickCnt: number;
    image: imageProps;
    createdAt: string;
    updatedAt: SVGStringList;
};

export type programSummaryProps = {
    id: number;
    mateId: number;
    title: string;
    station: string;
    thumbnailUrl: string;
    contents: string;
    price: number;
    currency: any;
    reviewsCount: number;
    likesCount: number;
    reservationDate: string;
    banner?: bannerProps[];
};

export type programCompProps = {
    program: programProps;
    isDetails: boolean;
};

export type programProps = {
    id: number;
    title: string;
    category: languageProps;
    images: imagesProps[];
    contents: string;
    htmlFilePath: string;
    currency: string;
    price: number;
    hiddenInfo: hiddenInfoProps;
    isEnd: boolean;
    isLike: boolean;
    isParking: boolean;
    isReserved: boolean;
    likes: number;
    mate: mateProps;
    recommendPrograms: programSummaryProps;
    reviews: number;
    station: string;
    thumbnail: string;
    xcoordinate: number;
    ycoordinate: number;
};

export type buttonProps = {
    text: string;
    classnames: string;
    type: string; // text / img
    onclick: Function;
};

export type favoriteProps = {
    size: string; // lg, md, sm
    isMate?: boolean;
    isLiked?: boolean;
    numberOfLike?: number;
    onclick?: Function;
    isFilledHeart?: boolean;
};

export type headerProps = {
    title?: string;
    isDepth?: boolean;
    isMobileDesc?: boolean;
    btns?: ReactNode;
};

export type keyVisualProps = {
    onlyBg?: boolean;
    src?: string;
    children: ReactElement;
};

export type imageProps = {
    id: number;
    fileName: string;
    url: string;
};

export type emblemProps = {
    id: number;
    title: string;
    image: imageProps;
    createdAt: string;
    updatedAt: string;
};

export type mateProps = {
    id: number;
    email: string;
    name: string;
    role?: 'MATE' | 'ADMIN';
    status?: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'BLOCKED';
    password?: string;
    locale?: string;
    image: imageProps;
    certified?: boolean;
    emblems?: emblemProps[];
    introduce: string;
};

export type mateCompProps = {
    isSummary?: boolean;
    mate: mateProps;
};

export type modalProps = {
    title?: string;
    children: any;
    type: string;
    closePortal: Function;
};

export type popupProps = {
    show?: boolean;
    title?: string;
    children: any;
    type: string;
    yesFunction?: Function;
    yesText?: string;
    noFucntion?: Function;
    noText?: string;
    closePortal: Function;
};

export type programInMypageProps = {
    id: number;
    status: string;
    name: string;
    date: string;
    applyDate: string;
    location: string;
    type?: string;
    children?: ReactElement;
};

export type reviewItemProps = {
    id: number;
    title: string;
    content: string;
    score: number;
    name: string;
};

export type reviewProps = {
    reviews: reviewItemProps[];
};

export type titleProps = {
    title: string;
    description?: string;
    icon?: string;
};

export type inputProps = {
    type: string;
    value: string;
    name: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    classnames?: string;
};

export type loginProps = {
    email: string;
    password: string;
};

export type languageProps = {
    id: number;
    title: string;
    contents: string;
    country: string;
};

export type paymentsProps = {
    programId: number;
    scheduleId: number;
    amount: number;
};
export type paymentsConfirmProps = {
    programId: number;
    scheduleId: number;
};

export type collectionsProps = {
    id: number;
    language: languageProps;
    programs: programSummaryProps[];
};

export type categoryProps = {
    id: number;
    type: string;
    language: languageProps;
    image: {
        id: number;
        image: imageProps;
    };
    createdAt: string;
    updatedAt: string;
};

// 프로그램 스케줄 조회
export type scheduleProps = {
    id: number;
    capacity: number;
    startDate: string;
    endDate: string;
    reservationDate: string;
    reservationCount: number;
};

// 이용 가능한 스케줄들 조회
export type AvailableTimesProps = {
    selectedTime: scheduleProps;
    times: scheduleProps[];
    price: number;
    currency: string;
    onclick: (time: scheduleProps) => void;
    isBox?: boolean;
};

// buddy
export type buddyProps = {
    id: number;
    name: string;
    password: string;
    email: string;
    locale: string;
    status: string;
    certified: boolean;
    image: imageProps;
    createdAt: string;
    updatedAt: string;
};

export type qnaProps = {
    qna: qnaItemProps;
    language: string;
    handleDelete: Function;
};

export type qnaItemProps = {
    id: number;
    buddy: buddyProps;
    title: string;
    content?: string;
    answer: {
        id: number;
        email: string;
        name: string;
        introduce: string;
        role: string;
        status: string;
        password: string;
        locale: string;
        image: imageProps;
        certified: boolean;
        emblems: emblemProps[];
        inquiry: string;
        contents: string;
        createdAt: string;
        updatedAt: string;
    };
    isSecret: boolean;
    isOwner: boolean;
    createdAt: string;
    updatedAt: string;
};
export type responsePaymentProps = {
    reservationId: number;
    orderId: string;
    amount:number;
    scheduleId:number;
};

export type confirmPaymentProps = {
    responsePayment: responsePaymentProps;
    program: programProps;
    scheduleId: number;
    closeWidget: () => void;
};

// 프로그램 문의하기
export type inquiryProps = {
    title: string;
    content: string;
    isSecret: boolean;
};

// 프로그램 예약 취소
export type cancelProps = {
    id:number;
    reservationId:number;
    reason:string;
}

// 프로그램 예약 취소 사유 옵션
export type cancelReasonProps = {
    code:string;
    sortOrder:number;
    label:string;
}

// 프로그램 신청내역 조회
export type reservationHistoryProps = {
    id:number;
    status: string;
    startDate: string;
    createdAt: string;
    updatedAt: string;
    thumbnail: string;
    station: string;
    title: string;
}
