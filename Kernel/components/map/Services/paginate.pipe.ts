import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paginate'
})
export class PaginatePipe implements PipeTransform {
  transform(data: any[], config: any): any[] {
    // Implement pagination logic here based on the 'config'
    // Return the paginated data
    // Example: Use Array.slice() to paginate
    const startIndex = (config.currentPage - 1) * config.itemsPerPage;
    const endIndex = startIndex + config.itemsPerPage;
    return data.slice(startIndex, endIndex);
  }
}
