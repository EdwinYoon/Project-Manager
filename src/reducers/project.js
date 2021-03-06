import { Project } from 'actions';
import data from 'utils/data/demoData.json';

const initialState = {
  id: null,
  name: '',
  lanes: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case Project.ADD_PROJECT:
      localStorage.setItem('pm-project', JSON.stringify({
        ...state,
        name: action.name,
      }));

      return {
        ...state,
        name: action.name,
      };
    case Project.PROJECT_ADD_LANE:
      localStorage.setItem('pm-project', JSON.stringify({
        ...state,
        lanes: [
          ...state.lanes,
          action.id
        ],
      }));

      return {
        ...state,
        lanes: [
          ...state.lanes,
          action.id
        ]
      };
    case Project.PROJECT_DELETE_LANE:
      localStorage.setItem('pm-project', JSON.stringify({
        ...state,
        lanes: state.lanes.filter(laneId => laneId !== action.laneId),
      }));

      return {
        ...state,
        lanes: state.lanes.filter(laneId => laneId !== action.laneId),
      };
    case Project.PROJECT_MOVE_LANE: {
      const newProject = state.lanes.slice();
      const [selectedLane] = newProject.splice(action.sourceIndex, 1);

      newProject.splice(action.destIndex, 0, selectedLane);
      localStorage.setItem('pm-project', JSON.stringify({
        ...state,
        lanes: newProject,
      }));

      return {
        ...state,
        lanes: newProject,
      };
    }
    case Project.FETCH_PROJECT: {
      if (action.isDemo) {
        localStorage.setItem('pm-project', JSON.stringify(data.project));

        return {
          ...data.project,
        };
      }
      const { lanes: laneIds, name } = JSON.parse(localStorage.getItem('pm-project'));

      return {
        ...state,
        name,
        lanes: [
          ...laneIds
        ],
      };
    }
    case Project.DELETE_PROJECT:
      localStorage.removeItem('pm-project');
      localStorage.removeItem('pm-cards');
      localStorage.removeItem('pm-lanes');

      if (action.history) {
        action.history.push('/');
      }

      return initialState;
    default:
      return state;
  }
}

