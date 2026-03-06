#!/bin/bash

# HouseRentBD System Check Script
# This script verifies all system components are properly configured

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                        ║${NC}"
echo -e "${BLUE}║         HouseRentBD System Check                       ║${NC}"
echo -e "${BLUE}║                                                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check Node.js
echo -e "${BLUE}[1/10] Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js is installed: ${NODE_VERSION}"
else
    echo -e "${RED}✗${NC} Node.js is not installed"
    echo -e "${YELLOW}  Install from: https://nodejs.org/${NC}"
fi

# Check npm
echo ""
echo -e "${BLUE}[2/10] Checking npm...${NC}"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} npm is installed: v${NPM_VERSION}"
else
    echo -e "${RED}✗${NC} npm is not installed"
fi

# Check MongoDB
echo ""
echo -e "${BLUE}[3/10] Checking MongoDB...${NC}"
if command -v mongod &> /dev/null; then
    MONGO_VERSION=$(mongod --version | head -n 1)
    echo -e "${GREEN}✓${NC} MongoDB is installed"
    echo -e "  ${MONGO_VERSION}"
    
    # Check if MongoDB is running
    if pgrep -x "mongod" > /dev/null; then
        echo -e "${GREEN}✓${NC} MongoDB is running"
    else
        echo -e "${YELLOW}⚠${NC} MongoDB is installed but not running"
        echo -e "${YELLOW}  Start with: brew services start mongodb-community@7.0${NC}"
    fi
else
    echo -e "${RED}✗${NC} MongoDB is not installed"
    echo -e "${YELLOW}  Install from: https://www.mongodb.com/try/download/community${NC}"
fi

# Check frontend node_modules
echo ""
echo -e "${BLUE}[4/10] Checking frontend dependencies...${NC}"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Frontend dependencies not installed"
    echo -e "${YELLOW}  Run: npm install${NC}"
fi

# Check backend node_modules
echo ""
echo -e "${BLUE}[5/10] Checking backend dependencies...${NC}"
if [ -d "server/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Backend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Backend dependencies not installed"
    echo -e "${YELLOW}  Run: cd server && npm install${NC}"
fi

# Check frontend .env
echo ""
echo -e "${BLUE}[6/10] Checking frontend environment file...${NC}"
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} Frontend .env file exists"
    
    # Check if VITE_API_URL is set
    if grep -q "VITE_API_URL=http://localhost:5000/api" .env; then
        echo -e "${GREEN}✓${NC} VITE_API_URL is configured"
    else
        echo -e "${YELLOW}⚠${NC} VITE_API_URL may need verification"
    fi
else
    echo -e "${RED}✗${NC} Frontend .env file missing"
    echo -e "${YELLOW}  Copy from: .env.example${NC}"
fi

# Check backend .env
echo ""
echo -e "${BLUE}[7/10] Checking backend environment file...${NC}"
if [ -f "server/.env" ]; then
    echo -e "${GREEN}✓${NC} Backend .env file exists"
    
    # Check critical variables
    if grep -q "MONGODB_URI=" server/.env; then
        echo -e "${GREEN}✓${NC} MONGODB_URI is set"
    else
        echo -e "${YELLOW}⚠${NC} MONGODB_URI is missing"
    fi
    
    if grep -q "JWT_SECRET=" server/.env; then
        echo -e "${GREEN}✓${NC} JWT_SECRET is set"
    else
        echo -e "${YELLOW}⚠${NC} JWT_SECRET is missing"
    fi
else
    echo -e "${RED}✗${NC} Backend .env file missing"
    echo -e "${YELLOW}  Copy from: server/.env.example${NC}"
fi

# Check if backend server can start
echo ""
echo -e "${BLUE}[8/10] Checking backend server health...${NC}"
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Backend server is running and healthy"
else
    echo -e "${YELLOW}⚠${NC} Backend server is not running"
    echo -e "${YELLOW}  Start with: cd server && npm run dev${NC}"
fi

# Check if frontend dev server is running
echo ""
echo -e "${BLUE}[9/10] Checking frontend server...${NC}"
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Frontend server is running"
else
    echo -e "${YELLOW}⚠${NC} Frontend server is not running"
    echo -e "${YELLOW}  Start with: npm run dev${NC}"
fi

# Check Google OAuth configuration
echo ""
echo -e "${BLUE}[10/10] Checking Google OAuth configuration...${NC}"
if [ -f ".env" ] && grep -q "VITE_GOOGLE_CLIENT_ID=" .env; then
    GOOGLE_ID=$(grep "VITE_GOOGLE_CLIENT_ID=" .env | cut -d '=' -f2)
    if [[ $GOOGLE_ID == *"YOUR_"* ]] || [ -z "$GOOGLE_ID" ]; then
        echo -e "${YELLOW}⚠${NC} Google OAuth not configured (optional)"
        echo -e "${YELLOW}  See: MONGODB_SETUP_COMPLETE.md for setup guide${NC}"
    else
        echo -e "${GREEN}✓${NC} Google OAuth is configured"
    fi
else
    echo -e "${YELLOW}⚠${NC} Google OAuth not configured (optional)"
fi

# Summary
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}                      Summary                          ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Check MongoDB connection
echo -e "${BLUE}Testing MongoDB connection...${NC}"
if command -v mongosh &> /dev/null && pgrep -x "mongod" > /dev/null; then
    if mongosh --quiet --eval "db.version()" houserentbd > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Can connect to MongoDB database 'houserentbd'"
    else
        echo -e "${YELLOW}⚠${NC} MongoDB is running but database connection failed"
    fi
fi

echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo ""

# Determine what needs to be done
NEEDS_FRONTEND_DEPS=false
NEEDS_BACKEND_DEPS=false
NEEDS_MONGODB=false
NEEDS_BACKEND_START=false
NEEDS_FRONTEND_START=false

[ ! -d "node_modules" ] && NEEDS_FRONTEND_DEPS=true
[ ! -d "server/node_modules" ] && NEEDS_BACKEND_DEPS=true
! pgrep -x "mongod" > /dev/null && NEEDS_MONGODB=true
! curl -s http://localhost:5000/api/health > /dev/null 2>&1 && NEEDS_BACKEND_START=true
! curl -s http://localhost:5173 > /dev/null 2>&1 && NEEDS_FRONTEND_START=true

if [ "$NEEDS_FRONTEND_DEPS" = true ]; then
    echo -e "  1. Install frontend dependencies:"
    echo -e "     ${YELLOW}npm install${NC}"
    echo ""
fi

if [ "$NEEDS_BACKEND_DEPS" = true ]; then
    echo -e "  2. Install backend dependencies:"
    echo -e "     ${YELLOW}cd server && npm install${NC}"
    echo ""
fi

if [ "$NEEDS_MONGODB" = true ]; then
    echo -e "  3. Start MongoDB:"
    echo -e "     ${YELLOW}brew services start mongodb-community@7.0${NC}  (macOS)"
    echo -e "     ${YELLOW}sudo systemctl start mongod${NC}                (Linux)"
    echo ""
fi

if [ "$NEEDS_BACKEND_START" = true ]; then
    echo -e "  4. Start backend server (Terminal 1):"
    echo -e "     ${YELLOW}cd server && npm run dev${NC}"
    echo ""
fi

if [ "$NEEDS_FRONTEND_START" = true ]; then
    echo -e "  5. Start frontend server (Terminal 2):"
    echo -e "     ${YELLOW}npm run dev${NC}"
    echo ""
fi

if [ "$NEEDS_FRONTEND_DEPS" = false ] && [ "$NEEDS_BACKEND_DEPS" = false ] && [ "$NEEDS_MONGODB" = false ] && [ "$NEEDS_BACKEND_START" = false ] && [ "$NEEDS_FRONTEND_START" = false ]; then
    echo -e "${GREEN}✓ System is fully operational!${NC}"
    echo ""
    echo -e "  Access the application:"
    echo -e "  • Frontend: ${BLUE}http://localhost:5173${NC}"
    echo -e "  • Backend:  ${BLUE}http://localhost:5000/api${NC}"
    echo -e "  • Health:   ${BLUE}http://localhost:5000/api/health${NC}"
    echo ""
    echo -e "  Default admin login:"
    echo -e "  • Phone:    ${BLUE}01700000000${NC}"
    echo -e "  • Password: ${BLUE}admin123${NC}"
fi

echo ""
echo -e "${BLUE}Documentation:${NC}"
echo -e "  • Complete guide:  ${YELLOW}COMPLETE_SYSTEM_README.md${NC}"
echo -e "  • Quick start:     ${YELLOW}SYSTEM_STARTUP_GUIDE.md${NC}"
echo -e "  • Quick reference: ${YELLOW}QUICK_REFERENCE.md${NC}"
echo -e "  • MongoDB setup:   ${YELLOW}MONGODB_SETUP_COMPLETE.md${NC}"
echo ""
echo -e "${GREEN}Check complete!${NC}"
echo ""
