import React, {useState} from 'react';
import {HomePrepTask} from '../store/transactionsSlice';

interface HomePrepTaskProps {
  route: any;
  navigation: any;
}

const HomePreptask: React.FC<HomePrepTaskProps> = ({route, navigation}) => {
  const [task, setTask] = useState<HomePrepTask>(route.params.task ?? {});

  return <></>;
};

export default HomePreptask;
