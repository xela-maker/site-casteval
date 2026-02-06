import { useParams } from 'react-router-dom';
import { CasaFormBase } from '@/components/admin/CasaFormBase';

export default function SelectCasaForm() {
  const { id } = useParams();
  
  return <CasaFormBase contextType="select" casaId={id} />;
}
