import React, { useState, useEffect } from 'react';

import KEY from './configs/config';

function App() {
  const [serverData, setServerData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = () => {
    fetch(`https://servers-frontend.fivem.net/api/servers/single/${KEY['endpoint']}`)
      .then((response) => response.json())
      .then((data) => {
        const sortedPlayers = data.Data.players.sort((a, b) => a.id - b.id);
        data.Data.players = sortedPlayers;
        
        setServerData(data.Data);
      })
      .catch((error) => console.error('Erro ao buscar os dados:', error));
  };

  const filterPlayers = (players, term) => {
    if (!term) {
      return players;
    }
  
    term = term.toLowerCase();
    return players.filter((player) => {
      return player.id.toString().includes(term) || player.name.toLowerCase().includes(term);
    });
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, (10 * 1000));

    return () => {
      clearInterval(intervalId);
    };
  }, [KEY['endpoint']]);

  return (
    <>
      {serverData ? (
        <div style={{
          padding: '20px',
        }}>
          <div style={{
            marginBottom: '20px',
          }}>

            <div style={{
              marginBottom: '10px',
            }}>
              <h1>Informações do Servidor</h1>
            </div>

            <div style={{
              marginBottom: '10px',
            }}>
              <p>Nome do servidor: <span style={{fontWeight: 'bold', color: 'rgb(53, 153, 204)'}}>{serverData.hostname}</span></p>
            </div>

            <div style={{
              marginBottom: '10px',
            }}>
              <p>Descrição do servidor: <span style={{fontWeight: 'bold', color: 'rgb(53, 153, 204)'}}>{serverData.vars.sv_projectDesc}</span></p>
            </div>

            <div style={{
              marginBottom: '10px',
            }}>
              <p>Players: <span style={{fontWeight: 'bold', color: 'rgb(53, 153, 204)'}}>{serverData.clients}/{serverData.svMaxclients}</span></p>
            </div>

            {serverData.vars.Discord && (
              <div style={{
                marginBottom: '10px',
              }}>
                <p>Discord: <a target='_blank' href={`https://${serverData.vars.Discord}`} style={{color: 'rgb(53, 153, 204)'}}>{serverData.vars.Discord}</a></p>
              </div>
            )}

            <div style={{
              marginBottom: '10px',
            }}>
              <p>Jogar: <a target='_blank' href={`fivem://connect/${serverData.connectEndPoints[0]}`} style={{color: 'rgb(53, 153, 204)'}}>{serverData.connectEndPoints[0]}</a></p>
            </div>

            <div style={{
              marginBottom: '10px',
            }}>
              <p>Owner: <a target='_blank' href={serverData.ownerProfile} style={{color: 'rgb(53, 153, 204)'}}>{serverData.ownerName}</a></p>
            </div>

            <div style={{
              marginBottom: '10px',
            }}>
              <p style={{
                backgroundColor: 'rgba(255, 255, 255, .1)',
                color: 'rgb(53, 153, 204)',
                fontWeight: 'bold',
                padding: '10px',
              }}>cfx.re/join/{KEY['endpoint']}</p>
            </div>

            <div>
              <img src={`https://servers-live.fivem.net/servers/icon/${KEY['endpoint']}/${serverData.iconVersion}.png`} />
            </div>

            {serverData.vars.banner_detail && (<div><img style={{ width: '90%' }} src={`${serverData.vars.banner_detail}`} /></div>)}
            {serverData.vars.banner_connecting && (<div><img src={`${serverData.vars.banner_connecting}`} /></div>)}
          </div>

          <div>
            <div style={{
              marginBottom: '10px',
            }}>
              <h1>Players</h1>
            </div>

            <div style={{
              marginBottom: '10px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}>
                <div>
                  <input
                    type='text'
                    placeholder='Pesquisar por ID ou Nome'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      padding: '5px',
                      fontSize: '16px',
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <ul style={{
                overflow: 'auto',
                backgroundColor: 'rgba(255, 255, 255, .1)',
                padding: '10px',
                maxHeight: '300px',
              }}>
              {filterPlayers(serverData.players, searchTerm).map((player) => (
                <li style={{listStyle: 'none', marginBottom: '10px'}} key={player.id}>
                  <p style={{
                    marginBottom: '5px',
                    color: (player.id.toString() === searchTerm || player.name === searchTerm ? 'red' : 'white'),
                  }}>
                    ID: {player.id} - <span style={{color: (player.id.toString() === searchTerm || player.name === searchTerm ? 'red' : 'rgb(53, 153, 204)')}}>{player.name}</span> | Ping: {player.ping}
                  </p>
                </li>
              ))}
              </ul>
            </div>

          </div>

        </div>
        
      ) : (
        <div style={{
          padding: '20px',
        }}>
          <div style={{
            marginBottom: '20px',
          }}>
            <h1>Carregando os dados do servidor...</h1>
          </div>
        </div>
      )}
    </>
  );
}

export default App;