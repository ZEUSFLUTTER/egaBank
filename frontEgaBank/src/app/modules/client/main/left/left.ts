import { Component, input, Input } from '@angular/core';
import { FormClient } from "./form-client/form-client";
import { ShowClient } from "./show-client/show-client";

@Component({
  selector: 'app-left',
  imports: [FormClient, ShowClient],
  templateUrl: './left.html',
  styleUrl: './left.scss',
})
export class Left {

@Input() isAdding : boolean = false;
@Input() isList : boolean = false;
}
