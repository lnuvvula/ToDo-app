export class DateTimeUtils {
    static formatDateTime(date) {
        try {
            if (!(date instanceof Date) || isNaN(date)) {
                throw new Error('Invalid date');
            }
            return new Intl.DateTimeFormat('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }).format(date);
        } catch (error) {
            return 'Invalid date';
        }
    }

    static formatDateTimeLocal(date) {
        try {
            if (!(date instanceof Date) || isNaN(date)) {
                throw new Error('Invalid date');
            }
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch (error) {
            const now = new Date();
            return this.formatDateTimeLocal(now);
        }
    }

    static isValidDate(date) {
        return date instanceof Date && !isNaN(date);
    }
}