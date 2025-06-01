import React from 'react';
import { Key } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/translations';
import ModalWrapper from '@/components/ui/modal-wrapper';

interface ApiKeyProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  onSave: () => void;
}

const ApiKey: React.FC<ApiKeyProps> = ({
  open,
  onOpenChange,
  apiKey,
  onApiKeyChange,
  onSave,
}) => {
  const { currentLanguage } = useLanguage();

  return (
    <ModalWrapper
      open={open}
      onOpenChange={onOpenChange}
      title={getTranslation('apiKey', currentLanguage)}
      icon={<Key className="h-6 w-6" />}
    >
      <Card>
        <CardHeader>
          <CardTitle>{getTranslation('apiKeySettings', currentLanguage)}</CardTitle>
          <CardDescription>
            {getTranslation('apiKeyDescription', currentLanguage)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              placeholder={getTranslation('enterApiKey', currentLanguage)}
            />
          </div>
          <Button onClick={onSave} className="w-full">
            {getTranslation('save', currentLanguage)}
          </Button>
        </CardContent>
      </Card>
    </ModalWrapper>
  );
};

export default ApiKey; 