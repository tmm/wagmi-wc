import { useMemo } from "react";
import { useAccount, useConnect, useConnections, useDisconnect, useSignMessage, useSwitchAccount } from "wagmi";

function App() {
  const account = useAccount();
  const connections = useConnections();

  const connect = useConnect();
  const disconnect = useDisconnect();
  const switchAccount = useSwitchAccount();
  const signMessage = useSignMessage();

  const inactiveConnectors = useMemo(() => {
    const connectorIdsMap = new Map(connections.map((connection) => [connection.connector.uid, true]));
    const result = [];
    for (const connector of connect.connectors) {
      if (connectorIdsMap.has(connector.uid)) continue;
      result.push(connector);
    }
    return result;
  }, [connections, connect.connectors]);

  return (
    <div>
      <div>
        {account.connector?.name}
        <br />
        {JSON.stringify(account.addresses)}
        <br />
        {account.chainId}
      </div>

      <hr />

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Accounts</th>
            <th>Chain ID</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {connections.map(({ accounts, chainId, connector }) => {
            const isDisconnecting =
              disconnect.isPending && typeof disconnect.variables?.connector === "object"
                ? disconnect.variables.connector.uid === connector.uid
                : false;
            const isSigningMessage =
              signMessage.isPending && typeof signMessage.variables?.connector === "object"
                ? signMessage.variables.connector.uid === connector.uid
                : false;
            return (
              <tr key={connector.uid}>
                <td>
                  {connector.name}
                  {connector.uid === account.connector?.uid ? " (active)" : ""}
                </td>
                <td>{JSON.stringify(accounts)}</td>
                <td>{chainId}</td>
                <td>
                  <button
                    disabled={isSigningMessage}
                    onClick={() => signMessage.signMessage({ connector, message: "foo bar baz" })}
                    type="button"
                  >
                    {isSigningMessage ? "Signing message..." : "Sign message"}
                  </button>
                  <button onClick={() => switchAccount.switchAccount({ connector })} type="button">
                    Switch
                  </button>
                  <button disabled={isDisconnecting} onClick={() => disconnect.disconnect({ connector })} type="button">
                    {isDisconnecting ? "Disconnecting..." : "Disconnect"}
                  </button>
                </td>
              </tr>
            );
          })}

          {inactiveConnectors.map((connector) => {
            const isConnecting =
              connect.isPending && typeof connect.variables?.connector === "object"
                ? connect.variables.connector.uid === connector.uid
                : false;
            return (
              <tr key={connector.uid}>
                <td>{connector.name}</td>
                <td>
                  <button disabled={isConnecting} onClick={() => connect.connect({ connector })} type="button">
                    {isConnecting ? "Connecting..." : "Connect"}
                  </button>
                </td>
                <td />
                <td />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
