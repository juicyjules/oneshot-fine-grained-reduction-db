{
  description = "Fine-Grained Reduction Database (FGRDB)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            python313
            python313Packages.pip
            python313Packages.virtualenv
            nodejs_20
            pnpm
            sqlite
            stdenv.cc.cc.lib
            zlib
          ];

          shellHook = ''
            echo "FGRDB Development Shell Loaded."
            echo "Python $(python --version)"
            echo "Node.js $(node --version)"
            echo "SQLite $(sqlite3 --version)"

            # Setup python virtual environment if it doesn't exist
            if [ ! -d ".venv" ]; then
              echo "Creating python virtual environment..."
              python -m venv .venv
            fi

            # Activate virtual environment automatically
            source .venv/bin/activate
            echo "Activated Python virtual environment."
            export LD_LIBRARY_PATH="${pkgs.stdenv.cc.cc.lib}/lib:${pkgs.zlib}/lib:$LD_LIBRARY_PATH"
          '';
        };
      });
}