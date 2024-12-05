'use client';

import { Button, ButtonProps } from '@components/ui/button';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';

interface ButtonWithPromiseProps extends ButtonProps {
    onClickAsync: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
    children: React.ReactNode;
    loader?: React.ReactNode;
}

export function ButtonWithPromise({ onClickAsync, loader, children, ...props }: ButtonWithPromiseProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsLoading(true);
        try {
            await onClickAsync(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button {...props} onClick={handleClick} disabled={isLoading || props.disabled}>
            {isLoading ? (
                loader ? (
                    loader
                ) : (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                    </>
                )
            ) : (
                children
            )}
        </Button>
    );
}
