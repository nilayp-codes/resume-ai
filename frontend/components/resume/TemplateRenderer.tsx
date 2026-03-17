'use client';

import type { ResumeData, ColorTheme, FontFamily, TemplateType } from '@/lib/types';
import { A4Wrapper } from '@/components/resume/A4Wrapper';
import { ModernTemplate } from '@/components/templates/ModernTemplate';
import { ExecutiveTemplate } from '@/components/templates/ExecutiveTemplate';
import { ClassicTemplate } from '@/components/templates/ClassicTemplate';
import { MinimalTemplate } from '@/components/templates/MinimalTemplate';

interface TemplateRendererProps {
    template: TemplateType | string;
    data: ResumeData;
    colorTheme?: ColorTheme;
    fontFamily?: FontFamily;
}

const TEMPLATE_MAP: Record<string, React.ComponentType<{ data: ResumeData; colorTheme: ColorTheme; fontFamily: FontFamily }>> = {
    modern: ModernTemplate,
    executive: ExecutiveTemplate,
    classic: ClassicTemplate,
    minimal: MinimalTemplate,
};

export default function TemplateRenderer({ template, data, colorTheme = 'blue', fontFamily = 'inter' }: TemplateRendererProps) {
    const TC = TEMPLATE_MAP[template] || ModernTemplate;
    return (
        <A4Wrapper>
            <TC data={data} colorTheme={colorTheme} fontFamily={fontFamily} />
        </A4Wrapper>
    );
}
