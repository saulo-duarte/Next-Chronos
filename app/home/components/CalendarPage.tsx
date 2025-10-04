import { CalendarFilters } from './CalendarFields';
import HomeCalendar from '@/components/HomeCalendar';
import { useState, useCallback } from 'react';

interface ViewOption {
  value: string;
  label: string;
}

const VIEW_OPTIONS: ViewOption[] = [
  { value: 'mês', label: 'Mês' },
  { value: 'semana', label: 'Semana' },
  { value: 'dia', label: 'Dia' },
  { value: 'agenda', label: 'Agenda' },
  { value: 'Lista do dia', label: 'Lista do Dia' },
];

const getLabelFromValue = (value: string): string => {
  const option = VIEW_OPTIONS.find((opt) => opt.value === value);
  return option ? option.label : value;
};

export default function CalendarPage() {
  const [viewTitle, setViewTitle] = useState(getLabelFromValue('Lista do dia'));

  const handleViewChange = useCallback((newViewValue: string) => {
    const newTitle: string = getLabelFromValue(newViewValue);
    setViewTitle(newTitle);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6">{viewTitle}</h1>

      <CalendarFilters onViewChange={handleViewChange} />

      <div className="mt-8 bg-background p-4 rounded-lg">
        <HomeCalendar />
      </div>
    </div>
  );
}
