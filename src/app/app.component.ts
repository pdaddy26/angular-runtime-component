import { Component } from '@angular/core';

import { Compiler, Injector, NgModule, NgModuleRef, ViewChild, ViewContainerRef } from "@angular/core";
import { HttpClient } from '@angular/common/http'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('vc', { read: ViewContainerRef }) _container: ViewContainerRef;

  constructor(private _compiler: Compiler,
    private _injector: Injector,
    private _m: NgModuleRef<any>,
    public http: HttpClient) {

  }

  ngAfterViewInit() {
    // const template = '<span>I am {{name}}</span>';
    
    this.http.get("./assets/template.json").subscribe((resp: any) => {
      var template = resp.template;
      console.log(template);

      const tmpCmp = Component({ template: template })(class {
      });
      const tmpModule = NgModule({ declarations: [tmpCmp] })(class {
      });

      this._compiler.compileModuleAndAllComponentsAsync(tmpModule)
        .then((factories) => {
          const f = factories.componentFactories[0];
          const cmpRef = f.create(this._injector, [], null, this._m);
          cmpRef.instance.name = 'On the fly 3';
          this._container.insert(cmpRef.hostView);
        })


    });


  }
}
