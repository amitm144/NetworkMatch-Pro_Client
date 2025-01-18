import { Building2 } from 'lucide-react';

export function CompanyLogo({ url, companyName }) {
  if (!url) {
    return (
      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center transition-all hover:shadow-lg">
        <Building2 className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img 
      src={url} 
      alt={`${companyName} logo`}
      className="p-4 object-contain rounded-lg transition-all hover:shadow-lg"
      onError={(e) => {
        e.target.onerror = null;
        e.target.style.display = 'none';
        e.target.parentElement.innerHTML = `
          <div class="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
            <svg class="h-8 w-8 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M16.5 6.75V15M15 8.25L18 8.25M8.25 15.75H15.75M12 12.75V19.5M8.25 19.5L15.75 19.5M7.5 4.5H16.5C18.1569 4.5 19.5 5.84315 19.5 7.5V16.5C19.5 18.1569 18.1569 19.5 16.5 19.5H7.5C5.84315 19.5 4.5 18.1569 4.5 16.5V7.5C4.5 5.84315 5.84315 4.5 7.5 4.5Z"/>
            </svg>
          </div>
        `;
      }}
    />
  );
}