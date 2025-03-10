interface FGIScoreProps {
  title: string;
  value: number;
  classification: string;
}

const getColorByClassification = (classification: string): string => {
  switch (classification.toLowerCase()) {
    case 'extreme fear':
      return '#E74C3C';
    case 'fear':
      return '#E67E22';
    case 'neutral':
      return '#F1C40F';
    case 'greed':
      return '#2ECC71';
    case 'extreme greed':
      return '#27AE60';
    default:
      return '#718096';
  }
};

export default function FGIScore({ title, value, classification }: FGIScoreProps) {
  const color = getColorByClassification(classification);
  
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
      <div className="flex items-center space-x-4">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: color }}
        />
        <span className="text-gray-700 font-medium">{title}</span>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-900 font-semibold">{value}</span>
        <span 
          className="text-sm px-3 py-1 rounded-full" 
          style={{ 
            backgroundColor: color,
            color: 'white',
            opacity: 0.9
          }}
        >
          {classification}
        </span>
      </div>
    </div>
  );
} 