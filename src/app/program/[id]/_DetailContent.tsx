'use client';
import React, { memo, useEffect, useRef, useState } from 'react';
import 'styles/detailContent.scss';
import { Button } from 'components/common/Button';

const DetailContent = memo(function DetailContent({ html }: { html: string }) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [isExpandable, setIsExpandable] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (!contentRef.current) return;

        const checkHeight = () => {
            if (contentRef.current && contentRef.current.scrollHeight > 650) {
                setIsExpandable(true);
            }
        };

        // Check initially
        checkHeight();

        // Also observe for changes (like images loading)
        const resizeObserver = new ResizeObserver(() => {
            checkHeight();
        });

        resizeObserver.observe(contentRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <div className="safe_detail_content_wrapper" style={{ position: 'relative' }}>
            <div
                ref={contentRef}
                className="safe_detail_content"
                dangerouslySetInnerHTML={{ __html: html }}
                style={isExpandable && !isExpanded ? { maxHeight: '650px', overflow: 'hidden' } : {}}
            />
            {isExpandable && !isExpanded && (
                <div className="more_button_wrapper" style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '150px',
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 80%)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    paddingBottom: '20px'
                }}>
                    <Button type="text" classnames="border lightgray radius_8 wide" onclick={() => setIsExpanded(true)} text="More" />
                </div>
            )}
        </div>
    );
});

export default DetailContent;