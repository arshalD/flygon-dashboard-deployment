import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Component } from 'react'
import firebase from "firebase/app";
import 'firebase/storage'

var ref;
var imageUrls = []
class AddImage extends Component {
  state = {
    fileList: [],
    uploading: false,
    status: false,
    error: false,
  };

  componentDidMount= ()=> {
    ref = firebase.storage().ref();

    }
  handleUpload = () => {
    this.props.spinner()
    this.setState({
      uploading: true,
    })
     if(!this.state.status){
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('files[]', file);
    });

    
    console.log('file list', fileList);
    fileList.forEach(file => {

      if (file.type === 'image/jpeg' || file.type === 'image/png')         
        { 
          const name = (+new Date()) + '-' + file.name;
          const metadata = {
            contentType: file.type
          };
          ref.child(name).put(file, metadata)
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then((url) => {
              console.log(url);
              this.props.addImages(url,fileList.length);
              message.success(`Uploaded ${file.name}`);
            })
            .catch((error)=>{
                this.setState({
                    uploading: false,
                    error: true,
                    status: false
                  });
                  message.warning(error);
                  
            }); 
        }
        else {
            message.warning('Upload Only png or jpeg files');
        }
    });
     }
     else{
        message.warning('Already uploaded');
     }
     this.setState({uploading:false})
    }

  render() {
    const { uploading, fileList, status } = this.state;
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };

    return (
      <>
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
        <Button
          type="primary"
          onClick={this.handleUpload}
          disabled={fileList.length === 0}
          style={{ marginTop: 16 }}
        >
          {uploading ? 'Uploading' : 'Start Upload'}
        </Button>
      </>
    );
  }
}

export default AddImage