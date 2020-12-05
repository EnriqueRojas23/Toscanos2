import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { OrdenService } from 'src/app/_services/seguimiento/orden.service';
import { AuthService } from 'src/app/_services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload_file',
  templateUrl: './upload_file.component.html',
  styleUrls: ['./upload_file.component.css']
})
export class Upload_fileComponent implements OnInit {
  div_visible = false;
  public progress: number;
  public message: string;
  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  UserId: number;

  @Output() public onUploadFinished = new EventEmitter();

  constructor(private http: HttpClient,
              private ordenService: OrdenService,
              private authService: AuthService,
              private router: Router,
              private toastr: ToastrService) {


     }

  ngOnInit() {

    const token = this.authService.jwtHelper.decodeToken(localStorage.getItem('token'));
    this.UserId = token.nameid;
  }
  fileProgress(fileInput: any) {
    this.fileData =  fileInput.target.files[0] as File;
    this.preview();

}

preview() {
  // Show preview
  const mimeType = this.fileData.type;
  if (mimeType.match(/image\/*/) == null) {
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(this.fileData);
  reader.onload = (_event) => {
    this.previewUrl = reader.result;
  };
}

  public uploadFile  = (files) => {
    this.div_visible = true;

    if (files.length === 0) {

      // this.alertify.warning("Debe seleccionar un archivo");
      this.toastr.warning('Debe seleccionar un archivo'
      , 'Subir File', {
        closeButton: true
      });

      return ;
    }

    const fileToUpload =  files[0] as File;
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);



    this.ordenService.uploadFile(formData, this.UserId ).subscribe(event => {
          this.div_visible = false;
          this.toastr.success('Se cargo correctamente'
           , 'Subir File', {
             closeButton: true
           });
          this.router.navigate(['seguimiento/listaorden']);
    }, error => {
      this.div_visible = false;
      this.toastr.warning(error.error.text
      , 'Subir File', {
        closeButton: true
      });

    }, () => {
      // this.router.navigate(['/dashboard']);
    });
  }
  downloadFile() {
         this.ordenService.downloadPlantilla();
  }
}
