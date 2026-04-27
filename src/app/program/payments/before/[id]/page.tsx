'use client';
import { getProgramDetailsWithToken, requestPayments, getCustomForm } from 'api';
import Header from 'components/Header/Header';
import ProgramInMypage from 'components/Program/ProgramInMypage';
import React, { useCallback, useEffect, useState } from 'react';
import 'styles/detailsPage.scss';
import { programProps, responsePaymentProps } from 'types/types';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from 'utils/stores';
import useMobile from 'hooks/useMobile';
import WidgetCheckout from 'components/common/WidgetCheckout';
import { Button } from '@/components/common/Button';
import { t } from "utils/i18n";

const BeforePayment = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [program, setProgram] = useState<programProps | null>(null);
    const [customFormData, setCustomFormData] = useState<any>(null);

    // 결제 
    const [responsePayment, setResponsePayment] = useState<responsePaymentProps | null>(null);
    const [readyToPay, setReadyToPay] = useState<boolean>(false);

    // check icon
    const [isChecked, setIsChecked] = useState<boolean>(true); // default to true since "위 내용을 확인했습니다" is usually checked or requires check, but since we add form we might want it true or keep false

    // custom form answers
    const [formAnswers, setFormAnswers] = useState<Record<string, string>>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const { id } = useParams();
    const searchParams = useSearchParams();
    const scheduleId = searchParams.get('scheduleId');
    const dateText = searchParams.get('dateText') || '';
    const isMobile = useMobile();

    // 로그인 여부
    const userInfo = useAuthStore((state) => state.userInfo);
    const router = useRouter();

    const loadData = useCallback(async () => {
        try {
            if (!id) return;
            const programIdStr = Array.isArray(id) ? id[0] : id;

            // Fetch program details
            const programRes = await getProgramDetailsWithToken(programIdStr, userInfo?.token);
            setProgram(programRes.data);

            // Fetch custom form data
            const customRes = await getCustomForm(Number(programIdStr));
            setCustomFormData(customRes.data);

            if (!customRes.data || (Array.isArray(customRes.data) && customRes.data.length === 0)) {
                setIsChecked(true); // Auto check if no custom form, though it's typically user click. We'll leave it as isChecked logic
            } else {
                setIsChecked(false);
            }

            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }, [id, userInfo]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handlePayment = async () => {
        if (!isFormValid) {
            alert(t("필수 입력값을 올바르게 입력해주세요."));
            return;
        }
        try {
            if (!program || !scheduleId) return;
            const values = {
                programId: program.id,
                scheduleId: Number(scheduleId),
                amount: program.price,
                method: 'CARD',
            };
            const res = await requestPayments(values);
            const data = res.data;
            if (data) {
                setResponsePayment(data);
                setReadyToPay(true);
            }
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || t("결제 요청 중 오류가 발생했습니다."));
        }
    };

    const closeWidget = () => {
        setReadyToPay(false);
    };

    const handleCustomFormChange = (id: string, value: string, field: any) => {
        setFormAnswers(prev => ({ ...prev, [id]: value }));
        if (field.validationRule && value) {
            try {
                const regex = new RegExp(field.validationRule);
                if (!regex.test(value)) {
                    setFormErrors(prev => ({ ...prev, [id]: t("입력 형식이 올바르지 않습니다.") }));
                } else {
                    setFormErrors(prev => { const newErr = { ...prev }; delete newErr[id]; return newErr; });
                }
            } catch (e) {
                setFormErrors(prev => { const newErr = { ...prev }; delete newErr[id]; return newErr; });
            }
        } else {
            setFormErrors(prev => { const newErr = { ...prev }; delete newErr[id]; return newErr; });
        }
    };

    const isFormValid = React.useMemo(() => {
        if (!customFormData || !Array.isArray(customFormData)) return true;
        return customFormData.every((field: any) => {
            const val = formAnswers[field.id];
            if (field.isRequired && (!val || val.trim() === '')) return false;
            if (formErrors[field.id]) return false;
            return true;
        });
    }, [customFormData, formAnswers, formErrors]);

    // isBtnActive checks just form validity since agreement check has been decoupled
    const isBtnActive = isFormValid;

    return (
        <div className="reservation_details before">
            <div className={`wrapper ${isMobile ? 'mobile' : ''}`}>
                <Header title={t("모임 신청")} isDepth={true} isLogin={userInfo !== null} />
                {
                    loading ? <div className="contents"><div className="section">{t("로딩 중...")}</div></div> :
                        program ?
                            <div className="contents">
                                <div className="section program_info">
                                    <div className="sub_title">{t("모임 정보")}</div>
                                    <div className="desc">
                                        <ProgramInMypage
                                            reservation={{
                                                ...program,
                                                programId: program.id,
                                                reservationId: 0,
                                                label: '',
                                                reservationStatus: '',
                                                paymentsStatus: '',
                                                startDate: dateText,
                                                createdAt: '',
                                                updatedAt: '',
                                                thumbnail: program.thumbnail,
                                                station: program.station || '',
                                                title: program.title,
                                                price: program.price,
                                                currency: program.currency
                                            } as any}
                                            type={'simple'}
                                        />
                                    </div>
                                </div>

                                {customFormData && Array.isArray(customFormData) && customFormData.length > 0 && (
                                    <div className="section">
                                        <div className="desc custom_form_area">
                                            {customFormData.map((field: any) => (
                                                <div key={field.id} className="field_item">
                                                    <div className="field_title">
                                                        {field.isRequired && <span className="bold required">{t("(필수)")}</span>}
                                                        {t(field.fieldLabel)}
                                                    </div>
                                                    {field.fieldType?.toLowerCase() === 'textarea' ? (
                                                        <textarea
                                                            placeholder={field.placeholder}
                                                            maxLength={1000}
                                                            className="field_textarea"
                                                            value={formAnswers[field.id] || ''}
                                                            onChange={(e) => handleCustomFormChange(field.id, e.target.value, field)}
                                                        />
                                                    ) : field.fieldType?.toLowerCase() === 'select' ? (
                                                        <select
                                                            className="field_select"
                                                            value={formAnswers[field.id] || ''}
                                                            onChange={(e) => handleCustomFormChange(field.id, e.target.value, field)}
                                                        >
                                                            <option value="" disabled>{t("선택해주세요")}</option>
                                                            {Array.isArray(field.options) && field.options.map((opt: any, idx: number) => {
                                                                const val = typeof opt === 'object' ? opt.value : opt;
                                                                const label = typeof opt === 'object' ? opt.label || opt.value : opt;
                                                                return <option key={idx} value={val}>{t(label)}</option>;
                                                            })}
                                                        </select>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            placeholder={field.placeholder}
                                                            maxLength={1000}
                                                            className="field_input"
                                                            value={formAnswers[field.id] || ''}
                                                            onChange={(e) => handleCustomFormChange(field.id, e.target.value, field)}
                                                        />
                                                    )}
                                                    <div className="error_and_count">
                                                        <div className="error_msg">
                                                            {formErrors[field.id] && formErrors[field.id]}
                                                        </div>
                                                        {field.fieldType?.toLowerCase() !== 'select' && (
                                                            <div className="char_count">
                                                                ({(formAnswers[field.id] || '').length}/1000)
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="section price_wrap">
                                    <div className="sub_title">{t("결제 정보")}</div>
                                    <div className="calculate_price">
                                        <div className="row">
                                            <div className="cate">{t("상품 금액")}</div>
                                            <div className="price">{program.currency} {program.price?.toLocaleString()}</div>
                                        </div>
                                        <div className="row total border_top" style={{ marginTop: '16px', paddingTop: '16px' }}>
                                            <div className="cate">{t("총 결제 금액")}</div>
                                            <div className="price">{program.currency} {program.price?.toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="section refund_wrap">
                                    <div className="sub_title">{t("환불 규정 안내")}</div>
                                    <div className="dots">
                                        <ul>
                                            <li>{t("결제 후 30분 경과 전 : 전액 환불")}</li>
                                            <li>{t("참여 확정 모임의 진행일 기준 4일 전까지 : 전액 환불")}</li>
                                            <li>{t("참여 확정 모임의 진행일 기준 3일 전부터 : 환불 불가")}</li>
                                            <li>{t("모임 진행 당일에 신청한 경우 : 환불 불가")}</li>
                                        </ul>
                                    </div>
                                    <div className="ico info">{t("결제 승인 취소는 영업일 기준 3~5일 소요될 수 있어요.")}</div>
                                </div>

                                <div className='bottom'>
                                    <div className="section check_wrap">
                                        {t("위 내용을 확인했으며, 이에 동의합니다.")}</div>
                                    <Button type="text" onclick={handlePayment} classnames={`wide radius_8 ${isBtnActive ? 'bg_blue' : 'bg_gray'}`} isDisabled={!isBtnActive} text={'Register for Event'} />
                                </div>
                            </div>
                            :
                            <div className="contents"><div className="section">{t("프로그램 정보를 불러오지 못했습니다.")}</div></div>
                }
            </div>

            {readyToPay && responsePayment && program && scheduleId && (
                <WidgetCheckout
                    responsePayment={responsePayment}
                    program={program}
                    scheduleId={Number(scheduleId)}
                    closeWidget={closeWidget}
                />
            )}
        </div>
    );
};

export default BeforePayment;
