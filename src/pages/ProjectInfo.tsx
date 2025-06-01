import React from 'react';
import { FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/core/contexts/LanguageContext';
import { getTranslation } from '@/lib/translations';
import ModalWrapper from '@/components/ui/modal-wrapper';

interface ProjectInfoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({
  open,
  onOpenChange,
}) => {
  const { currentLanguage } = useLanguage();

  return (
    <ModalWrapper
      open={open}
      onOpenChange={onOpenChange}
      title={getTranslation('aboutRTK', currentLanguage)}
      icon={<FileText className="h-6 w-6" />}
    >
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>ChatRTK</CardTitle>
            <CardDescription>Version 0.1.0</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {getTranslation('projectDescription', currentLanguage)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{getTranslation('features', currentLanguage)}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>{getTranslation('feature1', currentLanguage)}</li>
              <li>{getTranslation('feature2', currentLanguage)}</li>
              <li>{getTranslation('feature3', currentLanguage)}</li>
              <li>{getTranslation('feature4', currentLanguage)}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{getTranslation('credits', currentLanguage)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {getTranslation('creditsText', currentLanguage)}
            </p>
          </CardContent>
        </Card>
      </div>
    </ModalWrapper>
  );
};

export default ProjectInfo; 