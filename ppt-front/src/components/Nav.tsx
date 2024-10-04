"use client";

import Link from "next/link";
import React, { useEffect, PropsWithChildren, useState } from "react";

import DarkLightToggle from "./Theme";
export const Navigation = () => {

    return (
        <header>
            <div
				className={`fixed inset-x-0 top-0 z-50 backdrop-blur  duration-200  bg-zinc-900/500 `}
			>
				<div className="container flex flex-row-reverse items-center justify-between p-6 mx-auto">
					<div className="flex justify-between gap-8">
							<DarkLightToggle/>
					</div>

					<div
						className="duration-200 text-zinc-300 hover:text-zinc-100"
					>
						<h1 className="text-xl font-bold">PPT Classificador</h1>
					</div>
				</div>
			</div>

        
        </header>
    );
};