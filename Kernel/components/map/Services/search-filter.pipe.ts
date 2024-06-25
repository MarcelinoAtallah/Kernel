import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
  pure: true
})
export class SearchFilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) return [];

    if (!searchText) return items;

    return this.searchItems(items, searchText.toLowerCase());
  }

  private searchItems(items: any[], searchText:any): any[] {

   let results:any[] = [];
   //console.log(items);
      items.forEach(it => {
        //console.log(it);
        if (it.first_name.toLowerCase().includes(searchText)|| it.email.toLowerCase().includes(searchText)) {
            results.push(it);
        
        }
      });
      return results;
  }

}
