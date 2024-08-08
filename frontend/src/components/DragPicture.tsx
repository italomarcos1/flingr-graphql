import { CSSProperties, useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

// @ts-ignore
import { ReactComponent as CloseIcon } from '~/assets/close_white.svg';

import { Camera } from 'lucide-react';
// import { CropImageButton } from '~/styles/components';

type Props = {
  file: string;
  action?: string;
  format?: string;
  resolution?: string;
  accept?: string;
  setFile: (value: string) => void;
  deletePicture?: () => void;
  style?: CSSProperties;
  noCrop?: boolean;
  canDelete?: boolean;
}

export function DragPicture({ file, setFile }: Props) {
  const [error, setError] = useState('');

  // @ts-ignore
  const validator = useCallback((file) => {
    const { type } = file;
    const acceptedExtensions = ['jpeg', 'jpg', 'png'];

    const[, extension] = type.split('/')

    if(!acceptedExtensions.includes(extension)) {
      setError('Apenas imagens em JPEG/JPG ou PNG.');
      return {
        code: "name-too-large",
        message: `Name is larger than characters`
      };
    }

    return null;
  }, []);
  
  // @ts-ignore
  const onDrop = useCallback(async (acceptedFiles) => {
    try{
      console.log('acceptedFiles', acceptedFiles)
      const url = URL.createObjectURL(acceptedFiles[0]);
      
      setFile(url);
    } catch(e) {
      console.log('e', e)
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    validator,
    accept: "image/jpeg, image/jpg, image/png"
  });

  useEffect(() => {
    if(!!error) {
      setTimeout(() => setError(''), 3000);
    }
  }, [error])

  console.log("file", file)

  return (
    <div
      title="Arraste a imagem para cá ou clique para selecionar"
      className="relative w-32 h-32 flex items-center justify-center rounded-full duration-200 hover:scale-105 border-b border-b-[#494949]"
      {...getRootProps()}
    >
      {!!file && 
        <img
          src={file}
          alt=""
          className="absolute z-10 w-32 h-32 rounded-full object-cover border border-[#494949]"
        />
      }
      <div
        className={`absolute flex items-center justify-center z-20 w-32 h-32 duration-200 rounded-full bg-base-gray hover:bg-base-gray/70 border border-[#494949] ${!!file ? "bg-base-black hover:bg-black/80 opacity-0 hover:opacity-100" : ""}`}
      >
        <Camera
          size={64}
          strokeWidth={1}
          color="#494949"
        />
      </div>
      <input {...getInputProps()} />
    </div>
  )
}