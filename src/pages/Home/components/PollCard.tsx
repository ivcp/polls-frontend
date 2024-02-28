import { Poll } from '../../../services/polls';

const PollCard = ({ poll }: { poll: Poll }) => {
  return <div>{poll.id}</div>;
};

export default PollCard;
